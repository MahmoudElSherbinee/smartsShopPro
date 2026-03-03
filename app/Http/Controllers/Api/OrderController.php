<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $orders = Order::with(['user', 'order_items.product'])
            ->when(!$user->isAdmin(), function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->paginate($request->get('per_page', 15));

        return OrderResource::collection($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:500',
        ]);

        $user = $request->user();

        // Generate unique order number
        $orderNumber = 'ORD-' . strtoupper(uniqid());

        // Create order
        $order = Order::create([
            'order_number' => $orderNumber,
            'user_id' => $user->id,
            'status' => 'pending',
            'total' => 0, // Temporary, will update after items
            'notes' => $validatedData['notes'] ?? null,
        ]);

        $total = 0;

        // Create order items
        foreach ($validatedData['items'] as $item) {
            $product = Product::find($item['product_id']);

            // Check stock
            if ($product->stock < $item['quantity']) {
                return response()->json([
                    'message' => "Insufficient stock for product: {$product->name}",
                    'available' => $product->stock
                ], 422);
            }

            // Create order item
            $order->order_items()->create([
                'product_id' => $product->id,
                'product_name' => $product->name,
                'quantity' => $item['quantity'],
                'price' => $product->price,
            ]);

            // Reduce stock
            $product->decrement('stock', $item['quantity']);

            // Calculate total
            $total += $product->price * $item['quantity'];
        }

        // Update order total
        $order->update(['total' => $total]);

        // Load relationships for response
        $order->load(['order_items.product', 'user']);

        return new OrderResource($order);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Order $order)
    {
        $user = $request->user();

        // Check if user can view this order
        if (!$user->isAdmin() && $order->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order->load(['order_items.product', 'user']);
        return new OrderResource($order);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        $user = $request->user();

        // Only admin can update order status
        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validatedData = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled,refunded',
            'notes' => 'nullable|string|max:500',
        ]);

        $order->update($validatedData);
        $order->load(['order_items.product', 'user']);

        return new OrderResource($order);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Order $order)
    {
        $user = $request->user();

        // Only admin can delete orders
        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Restore stock before deleting
        foreach ($order->order_items as $item) {
            $item->product->increment('stock', $item->quantity);
        }

        $order->order_items()->delete();
        $order->delete();

        return response()->noContent();
    }

    /**
     * Cancel order (customer can cancel pending orders)
     */
    public function cancel(Request $request, Order $order)
    {
        $user = $request->user();
        // Check if user owns this order
        if ($order->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Only pending orders can be cancelled
        if ($order->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending orders can be cancelled'
            ], 422);
        }

        // Restore stock
        foreach ($order->order_items as $item) {
            $item->product->increment('stock', $item->quantity);
        }

        $order->update(['status' => 'cancelled']);

        return new OrderResource($order);
    }
}

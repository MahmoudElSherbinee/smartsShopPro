<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the user's orders.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $orders = Order::with(['order_items.product', 'user'])
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show(Request $request, Order $order)
    {
        Gate::authorize('view', $order);
        $user = $request->user();

        if ($order->user_id !== $user->id && !$user->isAdmin()) {
            abort(403);
        }

        $order->load(['order_items.product', 'user']);

        return Inertia::render('Orders/Show', [
            'order' => $order
        ]);
    }

    /**
     * Store new order (from cart)
     */
    public function store(Request $request)
    {

        $user = $request->user();

        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart.index')
                ->with('error', 'Your cart is empty!');
        }

        $validated = $request->validate([
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'notes' => 'nullable|string|max:500',
        ]);

        try {
            DB::beginTransaction();

            $total = 0;
            foreach ($cart as $item) {
                $total += $item['price'] * $item['quantity'];
            }

            $orderNumber = 'ORD-' . strtoupper(uniqid());

            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $user->id,
                'status' => 'pending',
                'total' => $total,
                'notes' => $validated['notes'] ?? null,
                'shipping_address' => $validated['address'],
                'shipping_city' => $validated['city'],
                'shipping_phone' => $validated['phone'],
            ]);

            foreach ($cart as $item) {
                $product = Product::find($item['id']);

                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Insufficient stock for {$product->name}");
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ]);

                $product->decrement('stock', $item['quantity']);
            }

            session()->forget('cart');
            DB::commit();

            return redirect()->route('orders.show', $order->id)
                ->with('success', 'Order placed successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to place order: ' . $e->getMessage());
        }
    }

    /**
     * Update order status (Admin only)
     */
    public function updateStatus(Request $request, Order $order)
    {
        Gate::authorize('update', $order);
        $user = $request->user();

        if (!$user->isAdmin()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled,refunded'
        ]);

        if ($validated['status'] === 'cancelled' && $order->status !== 'cancelled') {
            foreach ($order->order_items as $item) {
                $item->product->increment('stock', $item->quantity);
            }
        }

        $order->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Order status updated!');
    }

    /**
     * Cancel order (Customer only for pending orders)
     */
    public function cancel(Request $request, Order $order)
    {
        Gate::authorize('cancel', $order);
        $user = $request->user();

        if ($order->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }

        if ($order->status !== 'pending') {
            return redirect()->back()
                ->with('error', 'Only pending orders can be cancelled');
        }

        foreach ($order->order_items as $item) {
            $item->product->increment('stock', $item->quantity);
        }

        $order->update(['status' => 'cancelled']);
        return redirect()->back()->with('success', 'Order cancelled successfully');
    }

    /**
     * Admin: View all orders
     */
    public function adminIndex(Request $request)
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            abort(403);
        }

        $orders = Order::with(['user', 'order_items'])
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status'])
        ]);
    }
}

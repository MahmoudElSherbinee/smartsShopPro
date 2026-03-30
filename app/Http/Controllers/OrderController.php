<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\OrderService;
use App\Http\Requests\StoreOrderRequest;
use App\Enums\OrderStatus;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(
        private OrderService $orderService
    ) {}
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
    public function store(StoreOrderRequest $request)
    {
        $user = $request->user();

        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart.index')
                ->with('error', 'Your cart is empty!');
        }


        try {
            $order = $this->orderService->createOrder($user, $cart, $request->validated());
            session()->forget('cart');
            Log::info("Order: $order->order_number. Has been created Successfully");
            return redirect()->route('orders.show', $order->id)
                ->with('success', '✓ Order placed successfully! Your order number is ' . $order->order_number);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Error Man");
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


        $validated = $request->validate([
            'status' => ['required', 'in:' . implode(',', OrderStatus::values())]
        ]);

        try {
            $this->orderService->updateStatus($order, $validated['status']);

            return redirect()->back()
                ->with('success', 'Order status updated to ' . OrderStatus::from($validated['status'])->label());
        } catch (\Throwable $e) {
            return redirect()->back()
                ->with('error', 'Failed to update status: ' . $e->getMessage());
        }
    }

    /**
     * Cancel order (Customer only for pending orders)
     */
    public function cancel(Request $request, Order $order)
    {
        Gate::authorize('cancel', $order);

        try {
            $this->orderService->cancelOrder($order);
            return redirect()->back()->with('success', 'Order cancelled successfully');
        } catch (Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to cancel order: ' . $e->getMessage());
        }
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
            'filters' => $request->only(['status']),
            'statuses' => OrderStatus::labels(),
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $data = [];

        if ($user->isAdmin()) {
            $data = [
                'total_products' => Product::count(),
                'total_orders' => Order::count(),
                'total_customers' => User::where('type', 'customer')->count(),
                'total_vendors' => User::where('type', 'vendor')->count(),
                'total_revenue' => Order::sum('total'),
                'pending_orders' => Order::where('status', 'pending')->count(),
                'recent_orders' => Order::with('user')->latest()->take(5)->get(),
            ];
        } elseif ($user->isVendor()) {
            $vendorProducts = Product::where('user_id', $user->id)->pluck('id');

            $data = [
                'my_products' => Product::where('user_id', $user->id)->count(),
                'total_sales' => OrderItem::whereIn('product_id', $vendorProducts)->sum('quantity'),
                'total_revenue' => OrderItem::whereIn('product_id', $vendorProducts)
                    ->get()
                    ->sum(function ($item) {
                        return $item->price * $item->quantity;
                    }),
                'recent_orders' => Order::whereHas('order_items', function ($q) use ($vendorProducts) {
                    $q->whereIn('product_id', $vendorProducts);
                })->with('user')->latest()->take(5)->get(),
            ];
        } else {
            $data = [
                'my_orders' => Order::where('user_id', $user->id)->count(),
                'total_spent' => Order::where('user_id', $user->id)->sum('total'),
                'pending_orders' => Order::where('user_id', $user->id)->where('status', 'pending')->count(),
                'recent_orders' => Order::where('user_id', $user->id)
                    ->with('order_items')
                    ->latest()
                    ->take(5)
                    ->get(),
            ];
        }
        // dd($data);
        return Inertia::render('dashboard', $data);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display cart page
     */
    public function index()
    {
        $cart = session()->get('cart', []);
        $total = 0;

        // Calculate total and get product details
        foreach ($cart as $id => $item) {
            $total += $item['price'] * $item['quantity'];
        }

        return Inertia::render('Cart/Index', [
            'cart' => $cart,
            'total' => $total
        ]);
    }

    /**
     * Add product to cart
     */
    public function add(Request $request, Product $product)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:' . $product->stock
        ]);

        $cart = session()->get('cart', []);

        $quantity = $request->quantity;

        // If product already in cart, add to quantity
        if (isset($cart[$product->id])) {
            $cart[$product->id]['quantity'] += $quantity;
        } else {
            $cart[$product->id] = [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'quantity' => $quantity,
                'stock' => $product->stock,
                'image' => null
            ];
        }

        // Check if quantity exceeds stock
        if ($cart[$product->id]['quantity'] > $product->stock) {
            return redirect()->back()->with('error', 'Requested quantity exceeds available stock!');
        }

        session()->put('cart', $cart);

        return redirect()->back()->with('success', 'Product added to cart!');
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = session()->get('cart', []);

        if (isset($cart[$id])) {
            $product = Product::find($id);

            if ($request->quantity > $product->stock) {
                return redirect()->back()->with('error', 'Quantity exceeds available stock!');
            }

            $cart[$id]['quantity'] = $request->quantity;
            session()->put('cart', $cart);

            return redirect()->route('cart.index')->with('success', '✓ Cart updated successfully!');
        }

        return redirect()->route('cart.index')->with('error', 'Product not found in cart!');
    }

    /**
     * Remove item from cart
     */
    public function remove($id)
    {
        $cart = session()->get('cart', []);

        if (isset($cart[$id])) {
            $productName = $cart[$id]['name'];
            unset($cart[$id]);
            session()->put('cart', $cart);
            return redirect()->route('cart.index')->with('success', "✓ {$productName} removed from cart!");
        }

        return redirect()->route('cart.index')->with('error', 'Product not found in cart!');
    }

    /**
     * Clear entire cart
     */
    public function clear()
    {
        session()->forget('cart');
        return redirect()->route('cart.index')->with('success', 'Cart cleared!');
    }

    /**
     * Proceed to checkout
     */
    public function checkout()
    {
        $cart = session()->get('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart.index')
                ->with('error', 'Your cart is empty!');
        }

        $total = $this->calculateTotal($cart);

        // جلب stripe order من session
        $stripeOrderId = session('stripe_order_id');
        $stripeOrderTotal = session('stripe_order_total');

        // مسح session بعد الاستخدام
        if ($stripeOrderId) {
            session()->forget(['stripe_order_id', 'stripe_order_total']);
        }

        return Inertia::render('Cart/Checkout', [
            'cart' => $cart,
            'total' => $total,
            'flash' => session('flash'),
            'order_id' => $stripeOrderId,
            'order_total' => $stripeOrderTotal,
        ]);
    }

    /**
     * Calculate cart total
     */
    private function calculateTotal($cart)
    {
        $total = 0;
        foreach ($cart as $item) {
            $total += $item['price'] * $item['quantity'];
        }
        return $total;
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class WishlistController extends Controller
{
    /**
     * Display user's wishlist
     */
    public function index()
    {
        $wishlist = Wishlist::with('product.category')
            ->where('user_id', auth()->id())
            ->get();

        return Inertia::render('Wishlist/Index', [
            'wishlist' => $wishlist
        ]);
    }

    /**
     * Add product to wishlist
     */
    public function add(Product $product)
    {
        Gate::authorize('create', Wishlist::class);

        $existing = Wishlist::where('user_id', auth()->id())
            ->where('product_id', $product->id)
            ->first();

        if ($existing) {
            return redirect()->back()->with('info', 'Product already in wishlist!');
        }

        Wishlist::create([
            'user_id' => auth()->id(),
            'product_id' => $product->id,
        ]);

        return redirect()->back()->with('success', 'Product added to wishlist!');
    }

    /**
     * Remove product from wishlist
     */
    public function remove(Product $product)
    {
        $wishlistItem = Wishlist::where('user_id', auth()->id())
            ->where('product_id', $product->id)
            ->firstOrFail();

        Gate::authorize('delete', $wishlistItem);

        $wishlistItem->delete();

        return redirect()->back()->with('success', 'Product removed from wishlist!');
    }

     /**
     * Move product from wishlist to cart
     */
    public function moveToCart(Product $product)
    {
        // Add to cart (using existing cart system)
        $cart = session()->get('cart', []);

        if (isset($cart[$product->id])) {
            $cart[$product->id]['quantity']++;
        } else {
            $cart[$product->id] = [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'quantity' => 1,
                'stock' => $product->stock,
                'image' => null
            ];
        }

        session()->put('cart', $cart);

        // Remove from wishlist
        $wishlistItem = Wishlist::where('user_id', auth()->id())
            ->where('product_id', $product->id)
            ->first();

        if ($wishlistItem) {
            $wishlistItem->delete();
        }

        return redirect()->back()->with('success', 'Product moved to cart!');
    }
}

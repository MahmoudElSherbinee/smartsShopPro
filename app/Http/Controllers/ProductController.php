<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index(Request $request)
    {
        $products = Product::with('category')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(12);
        // dd($products);
        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product)
    {
        $product->load('category', 'reviews.user');

        return Inertia::render('Products/Show', [
            'product' => $product
        ]);
    }


    /**
     * Display product creation form

     */
    public function create()
    {
        Gate::authorize('create', Product::class);
        $categories = Category::all();
        return Inertia::render('Products/Create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store the created Product
     * @return Category::all() to specify the product category
     */
    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image'] = $path;
        }

        if (auth()->user()->isVendor() || auth()->user()->isAdmin()) {
            $validated['user_id'] = auth()->id();
        }

        Product::create($validated);

        return redirect('/products')->with('success', 'Product created!');
    }

    /**
     * Display product updating form
     * @param Product $product
     * @return \Inertia\Response
     */
    public function edit(Product $product)
    {
        Gate::authorize('update', $product);
        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => Category::all()
        ]);
    }



    /**
     * Apply the updates for Product
     * @param Request $request
     * @param Product $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $validated = $request->validated();
        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $path = $request->file('image')->store('products', 'public');
            $validated['image'] = $path;
        }


        $product->update($validated);

        return redirect('/products')->with('success', 'Product updated!');
    }



    public function destroy(Product $product)
    {
        Gate::authorize('delete', $product);
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
        return redirect('/products')->with('success', 'Product deleted successfully');
    }
}

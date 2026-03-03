<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\Gate;
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
        $product->load('category');

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
    public function store(Request $request)
    {
        Gate::authorize('create', Product::class);
        $validated = $request->validate([
            'name' => 'required',
            'slug' => 'required|unique:products',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            'category_id' => 'required|exists:categories,id'
        ]);

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
    public function update(Request $request, Product $product)
    {
        Gate::authorize('update', $product);
        $validated = $request->validate([
            'name' => 'sometimes|required',
            'price' => 'sometimes|numeric',
            'stock' => 'sometimes|integer',
        ]);

        $product->update($validated);

        return redirect('/products')->with('success', 'Product updated!');
    }



    public function destroy(Product $product)
    {
        Gate::authorize('delete', $product);
        $product->delete();
        return redirect('/products')->with('success', 'Product deleted successfully');
    }
}

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
        // أضف الـ withCount و withAvg مع بعض
        $query = Product::with('category')
            ->withAvg('approvedReviews', 'rating')
            ->withCount('approvedReviews');  // ← أضف هذا عشان نجيب عدد التقييمات

        // 1. Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // 2. Category Filter
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        // 3. Price Range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // 4. Rating Filter (min rating)
        if ($request->filled('rating')) {
            $rating = (int) $request->rating;
            $query->whereHas('approvedReviews')
                ->having('approved_reviews_avg_rating', '>=', $rating);
        }

        // 5. In Stock Only
        if ($request->boolean('in_stock')) {
            $query->where('stock', '>', 0);
        }

        // 6. Sorting
        switch ($request->sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'rating_desc':
                // ✅ أفضل المنتجات = (متوسط التقييم × عدد التقييمات)
                $query->orderByRaw('(approved_reviews_avg_rating * approved_reviews_count) DESC');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            default:
                $query->latest();
        }

        // 7. Categories for filter sidebar
        $categories = Category::withCount('products')->get();

        // 8. Pagination
        $products = $query->paginate(12)->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only([
                'search',
                'category',
                'min_price',
                'max_price',
                'rating',
                'sort',
                'in_stock'
            ]),
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

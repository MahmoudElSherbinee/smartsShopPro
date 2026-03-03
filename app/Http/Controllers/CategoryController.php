<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;


class CategoryController extends Controller
{
    /**
     * Display a listing of the categories.
     */
    public function index(Request $request)
    {
        $categories = Category::withCount('products')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->paginate(10);

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search'])
        ]);
    }
    /**
     * Show form for creating new category.
     */
    public function create()
    {
        Gate::authorize('create', Category::class);
        return Inertia::render('Categories/Create');
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request)
    {
        Gate::authorize('create', Category::class);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories|max:255',
        ]);

        Category::create($validated);

        return redirect('/categories')->with('success', 'Category created successfully!');
    }

    /**
     * Display the specified category with its products.
     */
    public function show(Category $category)
    {
        $category->load(['products' => function ($query) {
            $query->latest()->paginate(12);
        }]);

        return Inertia::render('Categories/Show', [
            'category' => $category
        ]);
    }
    /**
     * Show form for editing category.
     */
    public function edit(Category $category)
    {
        Gate::authorize('update', $category);
        return Inertia::render('Categories/Edit', [
            'category' => $category
        ]);
    }


    /**
     * Update the specified category.
     */
    public function update(Request $request, Category $category)
    {
        Gate::authorize('update', $category);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|unique:categories,slug,' . $category->id,
        ]);

        $category->update($validated);

        return redirect('/categories')->with('success', 'Category updated successfully!');
    }

    /**
     * Remove the specified category.
     */
    public function destroy(Category $category)
    {
        Gate::authorize('delete', $category);
        // Check if category has products
        if ($category->products()->count() > 0) {
            return redirect('/categories')->with('error', 'Cannot delete category with products!');
        }

        $category->delete();
        return redirect('/categories')->with('success', 'Category deleted successfully!');
    }
}

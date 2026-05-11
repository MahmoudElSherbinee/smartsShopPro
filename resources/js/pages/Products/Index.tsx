import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { Product, User } from '@/types';
import AddToCartButton from '@/components/AddToCartButton';
import ProductFilters from '@/components/ProductFilters';
import { useState } from 'react';
import { Sparkles, ShoppingBag, Heart, Package, TrendingUp, Search, Filter, X } from 'lucide-react';

interface Props {
    products: {
        data: Product[];
        links: any[];
        current_page: number;
        last_page: number;
        total: number;
    };
    categories: any[];
    filters: any;
}

interface PageProps extends Record<string, any> {
    auth: {
        user: User;
    };
}

export default function ProductsIndex({ products, categories, filters }: Props) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            router.delete(`/products/${id}`, {
                onSuccess: () => {
                    console.log('Product deleted');
                },
            });
        }
    };

    const removeFilter = (key: string) => {
        const newFilters = { ...filters };
        delete newFilters[key];
        router.get('/products', newFilters, { preserveState: true });
    };

    const getFilterLabel = (key: string, value: any): string => {
        switch (key) {
            case 'search': return `Search: ${value}`;
            case 'category':
                const category = categories.find(c => c.id == value);
                return `Category: ${category?.name || value}`;
            case 'min_price': return `Min Price: $${value}`;
            case 'max_price': return `Max Price: $${value}`;
            case 'rating': return `Rating: ${value}+ stars`;
            case 'in_stock': return 'In Stock Only';
            case 'sort': return `Sort: ${value}`;
            default: return `${key}: ${value}`;
        }
    };

    return (
        <AppLayout>
            <Head title="Products" />

            <div className="py-12 bg-linear-to-br from-gray-50 via-white to-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* AI Banner */}
                    <div className="relative mb-8 overflow-hidden bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl">
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
                        <div className="relative p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-white/80 text-sm font-medium tracking-wide">AI POWERED SHOPPING</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                Discover Products Tailored for You
                            </h2>
                            <p className="text-white/80">Browse our curated collection of premium products</p>
                        </div>
                    </div>

                    {/* Top Links */}
                    <div className="flex justify-end gap-3 mb-6">
                        <Link
                            href="/wishlist"
                            className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                        >
                            <Heart className="w-5 h-5 text-red-500" />
                            <span className="text-gray-700">Wishlist</span>
                        </Link>
                        <Link
                            href="/cart"
                            className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                        >
                            <ShoppingBag className="w-5 h-5 text-indigo-600" />
                            <span className="text-gray-700">Cart</span>
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                All Products
                            </h1>
                            <p className="text-gray-500 mt-1">{products.total} products available</p>
                        </div>
                        {(user.type === 'admin' || user.type === 'vendor') && (
                            <Link
                                href="/products/create"
                                className="bg-linear-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300"
                            >
                                + Add Product
                            </Link>
                        )}
                    </div>

                    {/* Mobile Search Bar */}
                    <div className="md:hidden mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={filters.search || ''}
                                onChange={(e) => {
                                    const newFilters = { ...filters, search: e.target.value };
                                    router.get('/products', newFilters, { preserveState: true });
                                }}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition"
                            />
                        </div>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="md:hidden w-full flex items-center justify-center gap-2 bg-white text-gray-700 py-3 rounded-xl mb-4 border border-gray-200 shadow-sm"
                    >
                        <Filter className="w-4 h-4" />
                        {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
                        {Object.keys(filters).filter(k => filters[k] && k !== 'sort').length > 0 && (
                            <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full">
                                {Object.keys(filters).filter(k => filters[k] && k !== 'sort').length}
                            </span>
                        )}
                    </button>

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Filters Sidebar - Desktop */}
                        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block md:w-80`}>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-4">
                                <ProductFilters
                                    filters={filters}
                                    categories={categories}
                                    total={products.total}
                                />
                            </div>
                        </div>

                        {/* Products Content */}
                        <div className="flex-1">
                            {/* Active Filters Chips */}
                            {Object.keys(filters).filter(k => filters[k] && k !== 'sort').length > 0 && (
                                <div className="mb-4 flex flex-wrap gap-2 items-center">
                                    {Object.entries(filters).map(([key, value]) => {
                                        if (!value || key === 'sort') return null;
                                        return (
                                            <span key={key} className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
                                                {getFilterLabel(key, value)}
                                                <button onClick={() => removeFilter(key)} className="hover:text-indigo-900">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        );
                                    })}
                                    {Object.keys(filters).filter(k => filters[k] && k !== 'sort').length > 0 && (
                                        <button
                                            onClick={() => router.get('/products', {}, { preserveState: true })}
                                            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Sort Dropdown - Desktop Top Right */}
                            <div className="flex justify-end mb-4">
                                <select
                                    value={filters.sort || ''}
                                    onChange={(e) => {
                                        const newFilters = { ...filters, sort: e.target.value };
                                        router.get('/products', newFilters, { preserveState: true });
                                    }}
                                    className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                                >
                                    <option value="">Sort by: Default</option>
                                    <option value="newest">Sort by: Newest</option>
                                    <option value="price_asc">Sort by: Price (Low to High)</option>
                                    <option value="price_desc">Sort by: Price (High to Low)</option>
                                    <option value="rating_desc">Sort by: Best Rating</option>
                                </select>
                            </div>

                            {/* Products Grid */}
                            {products.data.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No products found</p>
                                    <button
                                        onClick={() => router.get('/products', {}, { preserveState: true })}
                                        className="mt-4 text-indigo-600 hover:text-indigo-700"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {products.data.map(product => (
                                            <div
                                                key={product.id}
                                                className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200"
                                            >
                                                {/* Product Image */}
                                                <Link href={`/products/${product.id}`}>
                                                    <div className="aspect-square overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    </div>
                                                </Link>

                                                {/* Product Info */}
                                                <div className="p-4">
                                                    <Link href={`/products/${product.id}`}>
                                                        <h3 className="font-semibold text-lg mb-1 group-hover:text-indigo-600 transition-colors">
                                                            {product.name}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-gray-500 text-sm mb-2">{product.category?.name}</p>

                                                    {/* Rating Display */}
                                                    {product.average_rating && (
                                                        <div className="flex items-center gap-1 mb-2">
                                                            <div className="flex">
                                                                {[1, 2, 3, 4, 5].map(star => (
                                                                    <span key={star} className="text-sm">
                                                                        {star <= Math.round(product.average_rating || 0) ? '⭐' : '☆'}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <span className="text-xs text-gray-500">
                                                                ({product.reviews_count})
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className="flex justify-between items-center mt-3">
                                                        <span className="text-2xl font-bold text-green-600">
                                                            ${product.price}
                                                        </span>
                                                        <span className={`text-sm px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Add to Cart Button */}
                                                <div className="px-4 pb-4">
                                                    <AddToCartButton productId={product.id} stock={product.stock} />
                                                </div>

                                                {/* Bottom Actions */}
                                                <div className="px-4 pb-4 flex justify-between items-center">
                                                    {user.type === 'customer' && (
                                                        <button
                                                            onClick={() => {
                                                                if (product.in_wishlist) {
                                                                    router.delete(`/wishlist/remove/${product.id}`);
                                                                } else {
                                                                    router.post(`/wishlist/add/${product.id}`);
                                                                }
                                                            }}
                                                            className={`text-2xl transition-all duration-300 ${product.in_wishlist ? 'text-red-500 scale-110' : 'text-gray-300 hover:text-red-400'}`}
                                                        >
                                                            {product.in_wishlist ? '❤️' : '🤍'}
                                                        </button>
                                                    )}

                                                    {(user.type === 'admin' || (user.type === 'vendor' && product.user_id === user.id)) && (
                                                        <div className="flex gap-2">
                                                            <Link
                                                                href={`/products/${product.id}/edit`}
                                                                className="text-indigo-500 hover:text-indigo-700 text-sm px-3 py-1 rounded-lg border hover:bg-indigo-50 transition"
                                                            >
                                                                Edit
                                                            </Link>
                                                            {user.type === 'admin' && (
                                                                <button
                                                                    onClick={() => handleDelete(product.id, product.name)}
                                                                    className="text-red-500 hover:text-red-700 text-sm px-3 py-1 rounded-lg border hover:bg-red-50 transition"
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {products.links && products.links.length > 0 && (
                                        <div className="mt-8 flex justify-center">
                                            <div className="flex gap-1">
                                                {products.links.map((link: any, i: number) => (
                                                    <Link
                                                        key={i}
                                                        href={link.url || '#'}
                                                        className={`px-4 py-2 rounded-xl transition-all duration-300 ${link.active
                                                            ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                                            : link.url
                                                                ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                                                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                                            }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

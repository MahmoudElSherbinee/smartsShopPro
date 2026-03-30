import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { Product } from '@/types';
import AddToCartButton from '@/components/AddToCartButton';

interface Props {
    product: Product;
}

interface PageProps extends Record<string, any> {
    auth: {
        user: {
            type: string;
            id: number;
        };
    };
}

export default function Show({ product }: Props) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/products/${product.id}`);
        }
    };

    return (
        <AppLayout>
            <Head title={product.name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Top Bar */}
                    <div className="flex justify-between items-center mb-4">
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-700"
                        >
                            ← Back to Products
                        </Link>
                        <Link
                            href="/cart"
                            className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition"
                        >
                            <span className="text-xl">🛒</span>
                            <span className="text-gray-700">View Cart</span>
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 lg:p-8">
                            {/* Product Details */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column - Image */}
                                <div className="bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center min-h-400px">
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="max-w-full max-h-96 object-contain p-4"
                                    />
                                </div>

                                {/* Right Column - Info */}
                                <div className="space-y-6">
                                    <div>
                                        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                                        <Link
                                            href={`/categories/${product.category?.id}`}
                                            className="text-blue-500 hover:underline text-sm"
                                        >
                                            {product.category?.name}
                                        </Link>
                                    </div>

                                    <div className="border-t border-b py-4">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-green-600">
                                                ${product.price}
                                            </span>
                                            <span className={`text-sm ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                            </span>
                                        </div>
                                    </div>

                                    {product.description && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                                            <p className="text-gray-600 leading-relaxed">{product.description}</p>
                                        </div>
                                    )}

                                    {/* Add to Cart */}
                                    <div className="pt-4">
                                        <AddToCartButton productId={product.id} stock={product.stock} />
                                    </div>

                                    {/* Meta Info */}
                                    <div className="text-xs text-gray-400 pt-4 border-t">
                                        <p>Added: {new Date(product.created_at || '').toLocaleDateString()}</p>
                                        <p>Last updated: {new Date(product.updated_at || '').toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons (Admin/Vendor) */}
                            {(user.type === 'admin' || (user.type === 'vendor' && product.user_id === user.id)) && (
                                <div className="mt-8 pt-6 border-t flex gap-4">
                                    <Link
                                        href={`/products/${product.id}/edit`}
                                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                                    >
                                        Edit Product
                                    </Link>

                                    {user.type === 'admin' && (
                                        <button
                                            onClick={handleDelete}
                                            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                                        >
                                            Delete Product
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

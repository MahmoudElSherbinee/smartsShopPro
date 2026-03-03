import { Head, Link, router  } from '@inertiajs/react';
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
        };
    };
}

export default function Show({ product }: Props) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    return (
        <AppLayout>
            <Head title={product.name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header with Back Button */}
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">{product.name}</h1>
                                <Link
                                    href="/products"
                                    className="text-blue-500 hover:underline"
                                >
                                    ← Back to Products
                                </Link>
                            </div>

                            {/* Product Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column - Product Info */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Category</h3>
                                        <Link
                                            href={`/categories/${product.category?.id}`}
                                            className="text-blue-500 hover:underline"
                                        >
                                            {product.category?.name}
                                        </Link>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Price</h3>
                                        <p className="text-2xl font-bold text-green-600">
                                            ${product.price}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Stock</h3>
                                        <p className={`text-lg ${product.stock > 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                            }`}>
                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                        </p>
                                    </div>

                                    {product.description && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                            <p className="text-gray-700 mt-2">{product.description}</p>
                                        </div>
                                    )}

                                    <div className="text-sm text-gray-400 pt-4">
                                        <p>Added: {new Date(product.created_at || '').toLocaleDateString()}</p>
                                        <p>Last updated: {new Date(product.updated_at || '').toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Right Column - Image or Placeholder */}
                                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">📦</div>
                                        <p className="text-gray-500">Product Image</p>
                                    </div>
                                </div>
                            </div>
<div className="mt-4">
    <AddToCartButton productId={product.id} stock={product.stock} />
</div>
                            {/* Action Buttons (Admin/Vendor only) */}
                            {(user.type === 'admin' || user.type === 'vendor') && (
                                <div className="mt-8 pt-6 border-t flex gap-4">
                                    <Link
                                        href={`/products/${product.id}/edit`}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
                                    >
                                        Edit Product
                                    </Link>

                                    {user.type === 'admin' && (
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this product?')) {
                                                    router.delete(`/products/${product.id}`);
                                                }
                                            }}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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

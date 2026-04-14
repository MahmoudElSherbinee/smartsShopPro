import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';
import { Product, User } from '@/types';
import AddToCartButton from '@/components/AddToCartButton';

interface Props {
    products: {
        data: Product[];
        links: any[];
        current_page: number;
        last_page: number;
    };
}

interface PageProps extends Record<string, any> {
    auth: {
        user: User;
    };
}

export default function ProductsIndex({ products }: Props) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            router.delete(`/products/${id}`, {
                onSuccess: () => {
                    console.log('Product deleted');
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Products" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Links */}
                    <div className="flex justify-end mb-4">
                        <div className='mx-2'>
                            <Link
                            href="/wishlist"
                            className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition"
                        >
                            <span className="text-xl">❤️</span>
                            <span className="text-gray-700">Wishlist</span>
                        </Link>
                        </div>

                        <div className='mx-2'>
                            <Link
                            href="/cart"
                            className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition"
                        >
                            <span className="text-xl">🛒</span>
                            <span className="text-gray-700">View Cart</span>
                        </Link>
                        </div>
                    </div>


                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Products</h1>

                                {(user.type === 'admin' || user.type === 'vendor') && (
                                    <Link
                                        href="/products/create"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                    >
                                        + Add Product
                                    </Link>
                                )}
                            </div>

                            {/* Products Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.data.map(product => (
                                    <div
                                        key={product.id}
                                        className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                    >
                                        {/* Product Image */}
                                        <Link href={`/products/${product.id}`}>
                                            <div className="aspect-square overflow-hidden bg-gray-100">
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        </Link>

                                        {/* Product Info */}
                                        <div className="p-4">
                                            <Link href={`/products/${product.id}`}>
                                                <h3 className="font-semibold text-lg mb-1 hover:text-blue-500 transition">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <p className="text-gray-500 text-sm mb-1">{product.category?.name}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-xl font-bold text-green-600">
                                                    ${product.price}
                                                </span>
                                                <span className={`text-sm ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <div className="px-4 pb-4">
                                            <AddToCartButton productId={product.id} stock={product.stock} />
                                        </div>

                                        {/* Wishlist Button */}
                                        {user.type === 'customer' && (
                                            <button
                                                onClick={() => {
                                                    if (product.in_wishlist) {
                                                        router.delete(`/wishlist/remove/${product.id}`);
                                                    } else {
                                                        router.post(`/wishlist/add/${product.id}`);
                                                    }
                                                }}
                                                className={`text-2xl ${product.in_wishlist ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition`}
                                            >
                                                {product.in_wishlist ? '❤️' : '🤍'}
                                            </button>
                                        )}

                                        {/* Action Buttons (Admin/Vendor) */}
                                        {(user.type === 'admin' || (user.type === 'vendor' && product.user_id === user.id)) && (
                                            <div className="border-t p-3 bg-gray-50 flex justify-end gap-2">
                                                <Link
                                                    href={`/products/${product.id}/edit`}
                                                    className="text-blue-500 hover:text-blue-700 text-sm px-3 py-1 rounded border hover:bg-white transition"
                                                >
                                                    Edit
                                                </Link>

                                                {user.type === 'admin' && (
                                                    <button
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                        className="text-red-500 hover:text-red-700 text-sm px-3 py-1 rounded border hover:bg-white transition"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        )}
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
                                                className={`px-3 py-2 rounded-lg transition ${link.active
                                                        ? 'bg-blue-500 text-white'
                                                        : link.url
                                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

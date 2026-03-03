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

    console.log('Products page loaded');
    console.log('Products data:', products);
    console.log('User:', user);

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
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Products</h1>

                                {(user.type === 'admin' || user.type === 'vendor') && (
                                    <Link
                                        href="/products/create"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        + Add Product
                                    </Link>
                                )}
                            </div>

                            {/* Products Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {products.data.map(product => (
                                    <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                                        <Link href={`/products/${product.id}`}>
                                            <div className="p-4">
                                                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                                                <p className="text-gray-600">${product.price}</p>
                                                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                                                <p className="text-xs text-gray-400">Category: {product.category?.name}</p>
                                            </div>
                                        </Link>
                                        <div className="mt-4">
                                            <AddToCartButton productId={product.id} stock={product.stock} />
                                        </div>

                                        {/* Action Buttons */}
                                        {(user.type === 'admin' || (user.type === 'vendor' && product.user_id == user.id)) && (
                                            <div className="border-t p-3 bg-gray-50 flex justify-end space-x-2">
                                                <Link
                                                    href={`/products/${product.id}/edit`}
                                                    className="text-blue-500 hover:text-blue-700 text-sm px-3 py-1 border rounded"
                                                >
                                                    Edit
                                                </Link>

                                                {user.type === 'admin' && (
                                                    <button
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                        className="text-red-500 hover:text-red-700 text-sm px-3 py-1 border rounded"
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
                            {products.links && (
                                <div className="mt-6 flex justify-center space-x-1">
                                    {products.links.map((link: any, i: number) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 border rounded ${link.active
                                                ? 'bg-blue-500 text-white'
                                                : link.url
                                                    ? 'hover:bg-gray-100'
                                                    : 'text-gray-400 cursor-not-allowed'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

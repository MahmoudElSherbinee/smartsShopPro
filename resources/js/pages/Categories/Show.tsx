import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Category } from '@/types';

interface Props {
    category: Category & {
        products: any[];
    };
}

export default function Show({ category }: Props) {
    return (
        <AppLayout>
            <Head title={category.name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">{category.name}</h1>
                                <Link
                                    href="/categories"
                                    className="text-blue-500 hover:underline"
                                >
                                    Back to Categories
                                </Link>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-600">Slug: {category.slug}</p>
                            </div>

                            <h2 className="text-xl font-semibold mb-4">Products in this Category</h2>

                            {category.products && category.products.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {category.products.map(product => (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.id}`}
                                            className="border rounded-lg p-4 hover:shadow-lg transition"
                                        >
                                            <h3 className="font-bold">{product.name}</h3>
                                            <p className="text-gray-600">${product.price}</p>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No products in this category.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

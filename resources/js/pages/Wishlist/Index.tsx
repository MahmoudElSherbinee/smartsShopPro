import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';

interface WishlistItem {
    id: number;
    product: {
        id: number;
        name: string;
        price: number;
        stock: number;
        image_url: string;
        category?: { name: string };
    };
    created_at: string;
}

interface Props {
    wishlist: WishlistItem[];
}

interface PageProps extends Record<string, any> {
    auth: {
        user: {
            type: string;
        };
    };
}

export default function WishlistIndex({ wishlist }: Props) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const handleRemove = (productId: number, productName: string) => {
        if (confirm(`Remove "${productName}" from wishlist?`)) {
            router.delete(`/wishlist/remove/${productId}`);
        }
    };

    const handleMoveToCart = (productId: number) => {
        router.post(`/wishlist/move-to-cart/${productId}`);
    };

    const handleAddToCart = (productId: number, stock: number) => {
        if (stock > 0) {
            router.post(`/cart/add/${productId}`, { quantity: 1 });
        } else {
            alert('Out of stock!');
        }
    };

    return (
        <AppLayout>
            <Head title="My Wishlist" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

                            {wishlist.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 mb-4">Your wishlist is empty</p>
                                    <Link
                                        href="/products"
                                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                                    >
                                        Browse Products
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {wishlist.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between border rounded-lg p-4 hover:shadow-lg transition"
                                        >
                                            {/* Product Image */}
                                            <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
                                                <img
                                                    src={item.product.image_url}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 ml-4">
                                                <Link
                                                    href={`/products/${item.product.id}`}
                                                    className="font-semibold text-lg hover:text-blue-500"
                                                >
                                                    {item.product.name}
                                                </Link>
                                                <p className="text-gray-500 text-sm">{item.product.category?.name}</p>
                                                <p className="text-green-600 font-bold mt-1">
                                                    ${item.product.price}
                                                </p>
                                                <p className={`text-sm ${item.product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {item.product.stock > 0 ? `${item.product.stock} in stock` : 'Out of stock'}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                {user.type === 'customer' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleMoveToCart(item.product.id)}
                                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                                                        >
                                                            Move to Cart
                                                        </button>
                                                        <button
                                                            onClick={() => handleAddToCart(item.product.id, item.product.stock)}
                                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                                            disabled={item.product.stock === 0}
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleRemove(item.product.id, item.product.name)}
                                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
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

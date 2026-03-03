import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    stock: number;
    image?: string;
}

interface Props {
    cart: Record<number, CartItem>;
    total: number;
}

export default function CartIndex({ cart, total }: Props) {
    const [updating, setUpdating] = useState<number | null>(null);

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity < 1) return;

        setUpdating(id);
        router.put(`/cart/update/${id}`, { quantity }, {
            onFinish: () => setUpdating(null)
        });
    };

    const removeItem = (id: number) => {
        if (confirm('Remove this item from cart?')) {
            router.delete(`/cart/remove/${id}`);
        }
    };

    const clearCart = () => {
        if (confirm('Clear your entire cart?')) {
            router.delete('/cart/clear');
        }
    };

    const cartItems = Object.values(cart);

    return (
        <AppLayout>
            <Head title="Shopping Cart" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

                            {cartItems.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                                    <Link
                                        href="/products"
                                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    {/* Cart Items */}
                                    <div className="space-y-4 mb-6">
                                        {cartItems.map(item => (
                                            <div key={item.id} className="flex items-center justify-between border-b pb-4">
                                                <div className="flex-1">
                                                    <Link
                                                        href={`/products/${item.id}`}
                                                        className="font-semibold hover:text-blue-500"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    <p className="text-gray-600">${item.price}</p>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center border rounded">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            disabled={updating === item.id || item.quantity <= 1}
                                                            className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="px-4 py-1">
                                                            {updating === item.id ? '...' : item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            disabled={updating === item.id || item.quantity >= item.stock}
                                                            className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Cart Summary */}
                                    <div className="border-t pt-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="font-semibold">Total:</span>
                                            <span className="text-2xl font-bold text-green-600">
                                                ${total.toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <button
                                                onClick={clearCart}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Clear Cart
                                            </button>

                                            <Link
                                                href="/checkout"
                                                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                                            >
                                                Proceed to Checkout
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

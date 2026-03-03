import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface Props {
    cart: Record<number, CartItem>;
    total: number;
}

export default function Checkout({ cart, total }: Props) {
    const [processing, setProcessing] = useState(false);
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        phone: '',
        notes: ''
    });

    const cartItems = Object.values(cart);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/orders', formData, {
            onFinish: () => setProcessing(false)
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <AppLayout>
            <Head title="Checkout" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Order Summary */}
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                                    <div className="space-y-2 mb-4">
                                        {cartItems.map(item => (
                                            <div key={item.id} className="flex justify-between">
                                                <span>
                                                    {item.name} x {item.quantity}
                                                </span>
                                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between font-bold">
                                            <span>Total:</span>
                                            <span className="text-green-600">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Checkout Form */}
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block mb-1">Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                                className="w-full border rounded px-3 py-2"
                                                placeholder="Your address"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                required
                                                className="w-full border rounded px-3 py-2"
                                                placeholder="City"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                className="w-full border rounded px-3 py-2"
                                                placeholder="Phone number"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1">Notes (optional)</label>
                                            <textarea
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleChange}
                                                className="w-full border rounded px-3 py-2"
                                                placeholder="Any additional notes"
                                                rows={3}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
                                        >
                                            {processing ? 'Processing...' : 'Place Order'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

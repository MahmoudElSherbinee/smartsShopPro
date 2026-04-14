import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState, useEffect } from 'react';
import StripeCardElement from '@/components/StripeCardElement';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    stock: number;
}

interface Props {
    cart: Record<number, CartItem>;
    total: number;
    errors?: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
    };
    order_id?: number;
    order_total?: number;
}
export default function Checkout({ cart, total, errors = {}, flash = {}, order_id, order_total }: Props) {
    const { props } = usePage();
    console.log(usePage());
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [orderId, setOrderId] = useState<number | null>(order_id || null);
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        phone: '',
        notes: ''
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const cartItems = Object.values(cart);



    useEffect(() => {
        if (order_id) {
            setOrderId(order_id);
        }
    }, [order_id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const data = {
            ...formData,
            payment_method: paymentMethod
        };

        if (paymentMethod === 'cod') {
            router.post('/orders', data, {
                onSuccess: () => setProcessing(false),
                onError: (errors) => {
                    setFormErrors(errors);
                    setProcessing(false);
                }
            });
        } else {
            // Stripe: استخدم fetch للحصول على order_id
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

                const response = await fetch('/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken || '',
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok && result.order_id) {
                    setOrderId(result.order_id);
                    setProcessing(false);
                } else {
                    setFormErrors(result.errors || {});
                    setProcessing(false);
                }
            } catch (error) {
                console.error('Error creating order:', error);
                setProcessing(false);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (formErrors[e.target.name]) {
            setFormErrors({ ...formErrors, [e.target.name]: '' });
        }
    };

    return (
        <AppLayout>
            <Head title="Checkout" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Flash Messages
                    {flash.success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                            {flash.success}
                        </div>
                    )}
                    {flash.error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {flash.error}
                        </div>
                    )} */}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Checkout</h1>
                                <Link href="/cart" className="text-blue-500 hover:text-blue-700">
                                    ← Back to Cart
                                </Link>
                            </div>

                            {cartItems.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                                    <Link href="/products" className="bg-blue-500 text-white px-6 py-2 rounded">
                                        Continue Shopping
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Order Summary */}
                                    <div>
                                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                                        <div className="space-y-2 mb-4">
                                            {cartItems.map(item => (
                                                <div key={item.id} className="flex justify-between">
                                                    <span>{item.name} x {item.quantity}</span>
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
                                                <label className="block mb-1">Address *</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full border rounded px-3 py-2"
                                                    placeholder="Your address"
                                                />
                                                {(formErrors.address || errors.address) && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {formErrors.address || errors.address}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block mb-1">City *</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full border rounded px-3 py-2"
                                                    placeholder="City"
                                                />
                                                {(formErrors.city || errors.city) && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {formErrors.city || errors.city}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block mb-1">Phone *</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full border rounded px-3 py-2"
                                                    placeholder="Phone number"
                                                />
                                                {(formErrors.phone || errors.phone) && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {formErrors.phone || errors.phone}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Payment Method */}
                                            <div>
                                                <label className="block font-medium mb-2">Payment Method</label>
                                                <div className="space-y-2 border rounded-lg p-4 bg-gray-50">
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            value="cod"
                                                            checked={paymentMethod === 'cod'}
                                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                                            className="w-4 h-4"
                                                        />
                                                        <div>
                                                            <span className="font-medium">Cash on Delivery</span>
                                                            <p className="text-sm text-gray-500">Pay when you receive the product</p>
                                                        </div>
                                                    </label>

                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            value="stripe"
                                                            checked={paymentMethod === 'stripe'}
                                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                                            className="w-4 h-4"
                                                        />
                                                        <div>
                                                            <span className="font-medium">Credit Card (Stripe)</span>
                                                            <p className="text-sm text-gray-500">Pay securely with Visa, Mastercard, or Apple Pay</p>
                                                        </div>
                                                    </label>
                                                </div>
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

                                            {/* Submit Buttons */}
                                            {paymentMethod === 'cod' ? (
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 font-semibold"
                                                >
                                                    {processing ? 'Processing...' : 'Place Order (Cash on Delivery)'}
                                                </button>
                                            ) : (
                                                <div>
                                                    {orderId ? (
                                                        <StripeCardElement
                                                            orderId={orderId}
                                                            amount={total}
                                                            onSuccess={() => {
                                                                router.get('/orders');
                                                            }}
                                                            onError={(error) => {
                                                                alert('Payment failed: ' + error);
                                                                setProcessing(false);
                                                            }}
                                                        />
                                                    ) : (
                                                        <button
                                                            type="submit"
                                                            disabled={processing}
                                                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                                                        >
                                                            {processing ? 'Creating Order...' : 'Continue to Payment'}
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </form>
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

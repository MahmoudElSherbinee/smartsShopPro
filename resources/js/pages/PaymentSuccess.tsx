import { useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function PaymentSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');

    useEffect(() => {
        if (orderId) {
            setTimeout(() => {
                router.get(`/orders/${orderId}`);
            }, 3000);
        } else {
            setTimeout(() => {
                router.get('/orders');
            }, 3000);
        }
    }, [orderId]);

    return (
        <AppLayout>
            <Head title="Payment Successful" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-center">
                            <div className="text-6xl mb-4">✅</div>
                            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
                            <p className="text-gray-600 mb-4">Your order has been confirmed.</p>
                            <p className="text-sm text-gray-500">Redirecting to order details...</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    total: number;
    notes?: string;
    shipping_address?: string;
    shipping_city?: string;
    shipping_phone?: string;
    created_at: string;
    order_items: OrderItem[];
}

interface Props {
    order: Order;
}

interface PageProps extends Record<string, any> {
    auth: {
        user: {
            type: string;
        };
    };
}

export default function OrdersShow({ order }: Props) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this order?')) {
            router.post(`/orders/${order.id}/cancel`);
        }
    };

    return (
        <AppLayout>
            <Head title={`Order ${order.order_number}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold">Order {order.order_number}</h1>
                                    <p className="text-gray-600">
                                        Placed on {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <Link
                                    href="/orders"
                                    className="text-blue-500 hover:underline"
                                >
                                    ← Back to Orders
                                </Link>
                            </div>

                            {/* Status */}
                            <div className="mb-6">
                                <span className={`px-4 py-2 rounded-full ${getStatusColor(order.status)}`}>
                                    Status: {order.status}
                                </span>

                                {order.status === 'pending' && user.type === 'customer' && (
                                    <button
                                        onClick={handleCancel}
                                        className="ml-4 text-red-500 hover:text-red-700"
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </div>

                            {/* Order Items */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                                <div className="space-y-2">
                                    {order.order_items.map(item => (
                                        <div key={item.id} className="flex justify-between border-b pb-2">
                                            <span>
                                                {item.product_name} x {item.quantity}
                                            </span>
                                            <span>${item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 text-right font-bold">
                                    Total: ${order.total}
                                </div>
                            </div>

                            {/* Shipping Info */}
                            {(order.shipping_address || order.shipping_city || order.shipping_phone) && (
                                <div className="border-t pt-4">
                                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                                    <p>Address: {order.shipping_address}</p>
                                    <p>City: {order.shipping_city}</p>
                                    <p>Phone: {order.shipping_phone}</p>
                                    {order.notes && (
                                        <p className="mt-2 text-gray-600">Notes: {order.notes}</p>
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

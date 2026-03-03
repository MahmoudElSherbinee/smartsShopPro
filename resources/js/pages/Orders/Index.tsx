import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Order {
    id: number;
    order_number: string;
    status: string;
    total: number;
    created_at: string;
}

interface Props {
    orders: {
        data: Order[];
        links: any[];
    };
}

export default function OrdersIndex({ orders }: Props) {
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

    return (
        <AppLayout>
            <Head title="My Orders" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-2xl font-bold mb-6">My Orders</h1>

                            {orders.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 mb-4">No orders yet</p>
                                    <Link
                                        href="/products"
                                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                                    >
                                        Start Shopping
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.data.map(order => (
                                        <Link
                                            key={order.id}
                                            href={`/orders/${order.id}`}
                                            className="block border rounded-lg p-4 hover:shadow-lg transition"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold">{order.order_number}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                    <p className="font-bold mt-2">${order.total}</p>
                                                </div>
                                            </div>
                                        </Link>
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

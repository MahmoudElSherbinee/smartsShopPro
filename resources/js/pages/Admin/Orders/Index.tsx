import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

interface Order {
    id: number;
    order_number: string;
    status: string;
    total: number;
    user: { name: string };
    created_at: string;
}

interface Props {
    orders: {
        data: Order[];
        links: any[];
    };
    filters: {
        status?: string;
    };
}

export default function AdminOrdersIndex({ orders, filters }: Props) {
    const [updating, setUpdating] = useState<number | null>(null);

    const updateStatus = (orderId: number, status: string) => {
        setUpdating(orderId);
        router.put(`/orders/${orderId}/status`, { status }, {
            onFinish: () => setUpdating(null)
        });
    };

    const filterByStatus = (status: string) => {
        router.get('/admin/orders', { status }, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="Manage Orders" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

                            {/* Filters */}
                            <div className="mb-6 space-x-2">
                                <button
                                    onClick={() => filterByStatus('')}
                                    className={`px-4 py-2 rounded ${!filters.status ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                >
                                    All
                                </button>
                                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => filterByStatus(status)}
                                        className={`px-4 py-2 rounded ${filters.status === status ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>

                            {/* Orders Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-6 py-3 text-left">Order #</th>
                                            <th className="px-6 py-3 text-left">Customer</th>
                                            <th className="px-6 py-3 text-left">Date</th>
                                            <th className="px-6 py-3 text-left">Total</th>
                                            <th className="px-6 py-3 text-left">Status</th>
                                            <th className="px-6 py-3 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.data.map(order => (
                                            <tr key={order.id} className="border-b">
                                                <td className="px-6 py-4">
                                                    <Link href={`/orders/${order.id}`} className="text-blue-500 hover:underline">
                                                        {order.order_number}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4">{order.user.name}</td>
                                                <td className="px-6 py-4">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">${order.total}</td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                                        disabled={updating === order.id}
                                                        className="border rounded px-2 py-1"
                                                    >
                                                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link
                                                        href={`/orders/${order.id}`}
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

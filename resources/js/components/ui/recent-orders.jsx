import { Link } from '@inertiajs/react';

export default function RecentOrders({ orders, title = "Recent Orders" }) {
    if (!orders || orders.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                <p className="text-gray-500">No orders yet</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">{title}</h2>
            <div className="space-y-4">
                {orders.map((order) => (
                    <Link
                        key={order.id}
                        href={`/orders/${order.id}`}
                        className="block p-4 border rounded-lg hover:bg-gray-50 transition"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">{order.order_number}</p>
                                <p className="text-sm text-gray-500">
                                    {order.user?.name} • ${order.total}
                                </p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                                'bg-blue-100 text-blue-600'
                            }`}>
                                {order.status}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

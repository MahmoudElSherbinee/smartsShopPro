import { Head, usePage } from '@inertiajs/react';
import StatCard from '@/components/ui/stat-card';
import RecentOrders from '@/components/ui/recent-orders';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Products',
        href: '/products',
    },
    {
        title: 'Orders',
        href: '/orders',
    },
];

export default function Dashboard() {
    const { props } = usePage();
    const { auth } = usePage().props as any;
    const user = auth.user;

    const icons = {
        products: '📦',
        orders: '🛒',
        customers: '👥',
        vendors: '👤',
        revenue: '💰',
        pending: '⏳',
        sales: '📊',
        spent: '💳',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
                {/* Welcome Message */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Welcome back, {user.name}!
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Here's what's happening with your store today.
                    </p>
                </div>

                {/* Stats Cards - كل حسب نوع المستخدم */}
                {user.type === 'admin' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                        <StatCard title="Total Products" value={props.total_products} icon={icons.products} color="blue" />
                        <StatCard title="Total Orders" value={props.total_orders} icon={icons.orders} color="green" />
                        <StatCard title="Revenue" value={`$${props.total_revenue}`} icon={icons.revenue} color="purple" />
                        <StatCard title="Customers" value={props.total_customers} icon={icons.customers} color="yellow" />
                        <StatCard title="Vendors" value={props.total_vendors} icon={icons.vendors} color="orange" />
                        <StatCard title="Pending Orders" value={props.pending_orders} icon={icons.pending} color="red" />
                    </div>
                )}

                {user.type === 'vendor' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        <StatCard title="My Products" value={props.my_products} icon={icons.products} color="blue" />
                        <StatCard title="Total Sales" value={props.total_sales} icon={icons.sales} color="green" />
                        <StatCard title="Revenue" value={`$${props.total_revenue}`} icon={icons.revenue} color="purple" />
                    </div>
                )}

                {user.type === 'customer' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        <StatCard title="My Orders" value={props.my_orders} icon={icons.orders} color="blue" />
                        <StatCard title="Total Spent" value={`$${props.total_spent}`} icon={icons.spent} color="green" />
                        <StatCard title="Pending Orders" value={props.pending_orders} icon={icons.pending} color="yellow" />
                    </div>
                )}

                {/* Recent Orders */}
                <div className="mt-8">
                    <RecentOrders orders={props.recent_orders} />
                </div>
            </div>
        </AppLayout>
    );
}

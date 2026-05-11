import { Head, usePage } from '@inertiajs/react';
import StatCard from '@/components/ui/stat-card';
import RecentOrders from '@/components/ui/recent-orders';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import {
    TrendingUp,
    ShoppingBag,
    Users,
    Store,
    DollarSign,
    Clock,
    BarChart3,
    Sparkles,
    Package,
    CreditCard,
    Activity
} from 'lucide-react';

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

interface DashboardProps {
    total_products?: number;
    total_orders?: number;
    total_revenue?: number;
    total_customers?: number;
    total_vendors?: number;
    pending_orders?: number;
    my_products?: number;
    total_sales?: number;
    my_orders?: number;
    total_spent?: number;
    recent_orders?: any[];
}

export default function Dashboard() {
    const { props } = usePage();
    const { auth } = usePage().props as any;
    const user = auth.user;

    // Type assertion for props
    const dashboardProps = props as DashboardProps;

    const icons = {
        products: <Package className="w-6 h-6" />,
        orders: <ShoppingBag className="w-6 h-6" />,
        customers: <Users className="w-6 h-6" />,
        vendors: <Store className="w-6 h-6" />,
        revenue: <DollarSign className="w-6 h-6" />,
        pending: <Clock className="w-6 h-6" />,
        sales: <TrendingUp className="w-6 h-6" />,
        spent: <CreditCard className="w-6 h-6" />,
        activity: <Activity className="w-6 h-6" />,
    };

    const aiInsights = {
        predictedSales: '+23%',
        topProduct: 'iPhone 15 Pro',
        recommendation: 'Electronics category is trending',
        sentiment: 'Positive reviews increased by 15%'
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-linear-to-br from-gray-50 via-white to-gray-50">

                {/* AI Welcome Message with Gradient */}
                <div className="relative mb-8 overflow-hidden bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="relative p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-white/80 text-sm font-medium tracking-wide">AI INSIGHTS</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            Welcome back, {user.name}!
                        </h1>
                        <p className="text-white/80 text-lg mb-6">
                            Your store is performing great. Here's your AI-powered summary.
                        </p>

                        {/* AI Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                                <p className="text-white/60 text-xs font-medium">PREDICTED SALES</p>
                                <p className="text-white text-xl font-bold">{aiInsights.predictedSales}</p>
                                <p className="text-white/50 text-xs">vs last month</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                                <p className="text-white/60 text-xs font-medium">TOP PRODUCT</p>
                                <p className="text-white text-sm font-semibold truncate">{aiInsights.topProduct}</p>
                                <p className="text-white/50 text-xs">This week</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                                <p className="text-white/60 text-xs font-medium">AI RECOMMENDATION</p>
                                <p className="text-white text-sm font-semibold truncate">{aiInsights.recommendation}</p>
                                <p className="text-white/50 text-xs">Trending now</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                                <p className="text-white/60 text-xs font-medium">CUSTOMER SENTIMENT</p>
                                <p className="text-white text-sm font-semibold">{aiInsights.sentiment}</p>
                                <p className="text-white/50 text-xs">Last 30 days</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin Stats */}
                {user.type === 'admin' && (
                    <>
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Key Metrics</h2>
                                    <p className="text-sm text-gray-500">Real-time overview of your store</p>
                                </div>
                                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                                    View Details →
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                <StatCard title="Total Products" value={dashboardProps.total_products ?? 0} icon={icons.products} color="indigo" />
                                <StatCard title="Total Orders" value={dashboardProps.total_orders ?? 0} icon={icons.orders} color="emerald" />
                                <StatCard title="Revenue" value={`$${dashboardProps.total_revenue ?? 0}`} icon={icons.revenue} color="purple" />
                                <StatCard title="Customers" value={dashboardProps.total_customers ?? 0} icon={icons.customers} color="amber" />
                                <StatCard title="Vendors" value={dashboardProps.total_vendors ?? 0} icon={icons.vendors} color="rose" />
                                <StatCard title="Pending Orders" value={dashboardProps.pending_orders ?? 0} icon={icons.pending} color="orange" />
                            </div>
                        </div>
                    </>
                )}

                {/* Vendor Stats */}
                {user.type === 'vendor' && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Vendor Analytics</h2>
                                <p className="text-sm text-gray-500">Your sales performance</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            <StatCard title="My Products" value={dashboardProps.my_products ?? 0} icon={icons.products} color="indigo" />
                            <StatCard title="Total Sales" value={dashboardProps.total_sales ?? 0} icon={icons.sales} color="emerald" />
                            <StatCard title="Revenue" value={`$${dashboardProps.total_revenue ?? 0}`} icon={icons.revenue} color="purple" />
                        </div>
                    </div>
                )}

                {/* Customer Stats */}
                {user.type === 'customer' && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Customer Insights</h2>
                                <p className="text-sm text-gray-500">Your shopping activity</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            <StatCard title="My Orders" value={dashboardProps.my_orders ?? 0} icon={icons.orders} color="indigo" />
                            <StatCard title="Total Spent" value={`$${dashboardProps.total_spent ?? 0}`} icon={icons.spent} color="emerald" />
                            <StatCard title="Pending Orders" value={dashboardProps.pending_orders ?? 0} icon={icons.pending} color="amber" />
                        </div>
                    </div>
                )}

                {/* AI Recommendations Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-linear-to-r from-indigo-500 to-purple-500 rounded-lg">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">AI Recommendations</h2>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Powered by AI</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                            <div className="flex items-center gap-3 mb-3">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                <h3 className="font-semibold text-gray-900">Sales Prediction</h3>
                            </div>
                            <p className="text-gray-600 text-sm">Your sales are expected to increase by <strong className="text-green-600">23%</strong> next month based on current trends.</p>
                        </div>
                        <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                            <div className="flex items-center gap-3 mb-3">
                                <Package className="w-5 h-5 text-purple-600" />
                                <h3 className="font-semibold text-gray-900">Stock Alert</h3>
                            </div>
                            <p className="text-gray-600 text-sm"><strong className="font-medium">iPhone 15 Pro</strong> is running low. Consider restocking soon.</p>
                        </div>
                        <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                            <div className="flex items-center gap-3 mb-3">
                                <BarChart3 className="w-5 h-5 text-green-600" />
                                <h3 className="font-semibold text-gray-900">Top Category</h3>
                            </div>
                            <p className="text-gray-600 text-sm"><strong className="font-medium">Electronics</strong> is your best-selling category this month.</p>
                        </div>
                    </div>
                </div>

                {/* Recent Orders Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                            <p className="text-sm text-gray-500">Latest transactions</p>
                        </div>
                        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                            View All →
                        </button>
                    </div>
                    <RecentOrders orders={dashboardProps.recent_orders || []} />
                </div>
            </div>
        </AppLayout>
    );
}

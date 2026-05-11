import React from 'react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color?: 'indigo' | 'emerald' | 'purple' | 'amber' | 'rose' | 'orange' | 'blue' | 'green' | 'yellow' | 'red';
    trend?: number;
}

export default function StatCard({ title, value, icon, color = 'indigo', trend }: StatCardProps) {
    const colorClasses: Record<string, string> = {
        indigo: 'bg-indigo-50 text-indigo-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        purple: 'bg-purple-50 text-purple-600',
        amber: 'bg-amber-50 text-amber-600',
        rose: 'bg-rose-50 text-rose-600',
        orange: 'bg-orange-50 text-orange-600',
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        red: 'bg-red-50 text-red-600',
    };

    return (
        <div className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-gray-50 to-transparent rounded-bl-full opacity-50"></div>
            <div className="p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                        {trend && (
                            <p className={`text-xs mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
                            </p>
                        )}
                    </div>
                    <div className={`p-3 rounded-xl ${colorClasses[color]} transition-transform group-hover:scale-110 duration-300`}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
}

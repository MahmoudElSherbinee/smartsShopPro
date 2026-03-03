export default function StatCard({ title, value, icon, color = 'blue' }) {
    const colors = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        red: 'bg-red-100 text-red-600',
        purple: 'bg-purple-100 text-purple-600',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-semibold mt-2">{value}</p>
                </div>
                {icon && (
                    <div className={`p-3 rounded-lg ${colors[color]}`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}

import { Head } from '@inertiajs/react';
import {
    DollarSign,
    Truck,
    Package,
    Boxes,
    Users,
    AlertTriangle,
    TrendingUp,
    Receipt
} from 'lucide-react';

export default function Dashboard({
    stats = {},
    recentSales = [],
    recentPurchases = [],
    stockActivities = [],
    lowStockProducts = [],
}) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="p-6 space-y-8 bg-slate-950 text-slate-200 min-h-screen">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Warehouse Dashboard</h1>
                        <p className="text-slate-400 mt-1">Real-time overview of your operations</p>
                    </div>
                    <div className="text-sm text-slate-500">
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Today's Sales"
                        value={`₹${Number(stats.todaySale || 0).toLocaleString()}`}
                        icon={DollarSign}
                        color="text-emerald-400"
                        bgColor="bg-emerald-900/50"
                    />
                    <StatCard
                        title="Today's Purchases"
                        value={`₹${Number(stats.todayPurchase || 0).toLocaleString()}`}
                        icon={Truck}
                        color="text-amber-400"
                        bgColor="bg-amber-900/50"
                    />
                    <StatCard
                        title="Total Products"
                        value={Number(stats.products || 0).toLocaleString()}
                        icon={Package}
                        color="text-blue-400"
                        bgColor="bg-blue-900/50"
                    />
                    <StatCard
                        title="Total Variants"
                        value={Number(stats.variants || 0).toLocaleString()}
                        icon={Boxes}
                        color="text-purple-400"
                        bgColor="bg-purple-900/50"
                    />

                    <StatCard
                        title="Customers"
                        value={Number(stats.customers || 0).toLocaleString()}
                        icon={Users}
                        color="text-indigo-400"
                        bgColor="bg-indigo-900/50"
                    />
                    <StatCard
                        title="Suppliers"
                        value={Number(stats.suppliers || 0).toLocaleString()}
                        icon={Truck}
                        color="text-teal-400"
                        bgColor="bg-teal-900/50"
                    />
                    <StatCard
                        title="Low Stock"
                        value={Number(stats.lowStock || 0).toLocaleString()}
                        icon={AlertTriangle}
                        color="text-red-400"
                        bgColor="bg-red-900/50"
                    />
                    <StatCard
                        title="Inventory Value"
                        value={`₹${Number(stats.inventoryValue || 0).toLocaleString()}`}
                        icon={TrendingUp}
                        color="text-emerald-400"
                        bgColor="bg-emerald-900/50"
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Recent POS Sales */}
                    <DashboardTable
                        title="Recent POS Sales"
                        icon={Receipt}
                        columns={['Invoice', 'Amount', 'Payment', 'Date']}
                        data={recentSales}
                        emptyMessage="No recent sales"
                        renderRow={(sale) => (
                            <tr key={sale.id} className="border-b border-slate-800 hover:bg-slate-900">
                                <td className="px-6 py-4 font-medium text-white">{sale.invoice_no}</td>
                                <td className="px-6 py-4 font-semibold text-emerald-400">
                                    ₹{Number(sale.grand_total || 0).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 text-xs rounded-full bg-blue-900 text-blue-400">
                                        {sale.payment_method}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400">
                                    {new Date(sale.created_at).toLocaleDateString('en-IN')}
                                </td>
                            </tr>
                        )}
                    />

                    {/* Recent Purchases */}
                    <DashboardTable
                        title="Recent Purchases"
                        icon={Truck}
                        columns={['Purchase No', 'Supplier', 'Amount', 'Status', 'Date']}
                        data={recentPurchases}
                        emptyMessage="No recent purchases"
                        renderRow={(purchase) => (
                            <tr key={purchase.id} className="border-b border-slate-800 hover:bg-slate-900">
                                <td className="px-6 py-4 font-medium text-white">{purchase.purchase_no}</td>
                                <td className="px-6 py-4 text-slate-300">{purchase.supplier?.name || '—'}</td>
                                <td className="px-6 py-4 font-semibold text-emerald-400">
                                    ₹{Number(purchase.grand_total || 0).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={purchase.status} />
                                </td>
                                <td className="px-6 py-4 text-slate-400">
                                    {new Date(purchase.created_at).toLocaleDateString('en-IN')}
                                </td>
                            </tr>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Low Stock Products */}
                    <DashboardTable
                        title="Low Stock Products"
                        icon={AlertTriangle}
                        columns={['Product', 'Variant', 'Current Stock']}
                        data={lowStockProducts}
                        emptyMessage="No low stock items"
                        renderRow={(item) => (
                            <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-900">
                                <td className="px-6 py-4 text-white">{item.product?.name || '—'}</td>
                                <td className="px-6 py-4 text-slate-300">{item.name || '—'}</td>
                                <td className="px-6 py-4 font-semibold text-red-400">
                                    {item.varient_qty} left
                                </td>
                            </tr>
                        )}
                    />

                    {/* Recent Stock Activities */}
                    <DashboardTable
                        title="Recent Stock Activities"
                        icon={Boxes}
                        columns={['Product', 'Variant', 'Qty', 'Operation', 'Date']}
                        data={stockActivities}
                        emptyMessage="No recent stock activity"
                        renderRow={(activity) => (
                            <tr key={activity.id} className="border-b border-slate-800 hover:bg-slate-900">
                                <td className="px-6 py-4 text-white">{activity.varient?.product?.name || '—'}</td>
                                <td className="px-6 py-4 text-slate-300">{activity.varient?.name || '—'}</td>
                                <td className="px-6 py-4 font-medium">{activity.quantity}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 text-xs rounded-full ${
                                        activity.operation === 'add'
                                            ? 'bg-green-900 text-green-400'
                                            : 'bg-red-900 text-red-400'
                                    }`}>
                                        {activity.operation?.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400">
                                    {new Date(activity.created_at).toLocaleDateString('en-IN')}
                                </td>
                            </tr>
                        )}
                    />
                </div>
            </div>
        </>
    );
}

/* Reusable Components */
function StatCard({ title, value, icon: Icon, color, bgColor }) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <p className="text-3xl font-bold mt-3 text-white">{value}</p>
                </div>
                <div className={`p-3 rounded-2xl ${bgColor}`}>
                    <Icon className={`w-8 h-8 ${color}`} />
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const colors = {
        Pending: 'bg-yellow-900 text-yellow-400',
        Partial: 'bg-blue-900 text-blue-400',
        Received: 'bg-emerald-900 text-emerald-400',
        Completed: 'bg-emerald-900 text-emerald-400',
        Cancelled: 'bg-red-900 text-red-400',
    };

    return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${colors[status] || 'bg-slate-700 text-slate-300'}`}>
            {status}
        </span>
    );
}

function DashboardTable({ title, icon: Icon, columns, data, emptyMessage, renderRow }) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-3">
                <Icon className="w-5 h-5 text-slate-400" />
                <h2 className="font-semibold text-xl text-white">{title}</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-950">
                            {columns.map((col, i) => (
                                <th key={i} className="px-6 py-4 text-left text-xs font-semibold text-slate-400">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map(renderRow)
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="py-16 text-center text-slate-500">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
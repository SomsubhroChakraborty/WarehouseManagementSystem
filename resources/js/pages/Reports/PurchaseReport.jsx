import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PurchaseReport({
    reports = [],
    search = '',
    period = '',
}) {
    const { data, setData, get } = useForm({
        search,
        period,
    });

    const handleSearch = () => {
        get('/-/purchases-report', { data }, {
            preserveScroll: true,
            replace: true,
        });
    };

    const handleReset = () => {
        get('/-/purchases-report', {}, {
            preserveScroll: true,
            replace: true,
        });
    };

    // Safe number conversion
    const toNumber = (value) => Number(value || 0);

    // Calculations
    const totalPurchases = reports.length;

    const totalAmount = reports.reduce((sum, purchase) => {
        if (purchase.status !== 'Received') return sum;
        return sum + toNumber(purchase.grand_total);
    }, 0);

    const completedCount = reports.filter(p => p.status === 'Received').length;
    const pendingCount = reports.filter(p => p.status === 'Pending').length;
    const cancelledCount = reports.filter(p => p.status === 'Cancelled').length;

    return (
        <div className="space-y-6 p-6">
            <div className="text-2xl font-bold text-white">
                Purchase Report
            </div>

            {/* Filters */}
            <div className="flex items-end justify-between">
                <div className="flex items-end gap-3">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Search Supplier
                        </label>
                        <Input
                            placeholder="Supplier name or Invoice..."
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Period
                        </label>
                        <select
                            value={data.period}
                            onChange={(e) => setData('period', e.target.value)}
                            className="h-10 rounded-md border border-gray-300 px-3 focus:border-blue-500 focus:ring-1"
                        >
                            <option value="">All Time</option>
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    <Button onClick={handleSearch}>Search</Button>
                    <Button variant="destructive" onClick={handleReset}>
                        Reset
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-lg bg-white p-5 shadow">
                    <p className="text-sm text-gray-500">Total Purchases</p>
                    <h2 className="mt-2 text-3xl font-bold text-black">
                        {totalPurchases}
                    </h2>
                </div>

                <div className="rounded-lg bg-white p-5 shadow">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <h2 className="mt-2 text-3xl font-bold text-green-600">
                        ₹{totalAmount.toFixed(2)}
                    </h2>
                </div>

                <div className="rounded-lg bg-white p-5 shadow">
                    <p className="text-sm text-gray-500">Completed</p>
                    <h2 className="mt-2 text-3xl font-bold text-emerald-600">
                        {completedCount}
                    </h2>
                </div>

                <div className="rounded-lg bg-white p-5 shadow">
                    <p className="text-sm text-gray-500">Cancelled</p>
                    <h2 className="mt-2 text-3xl font-bold text-red-600">
                        {cancelledCount}
                    </h2>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#0F172B] text-white">
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-center">Purchase No</th>
                            <th className="px-4 py-3 text-center">Supplier</th>
                            <th className="px-4 py-3 text-center">Supplier Invoice</th>
                            <th className="px-4 py-3 text-center">Date</th>
                            <th className="px-4 py-3 text-center">Subtotal</th>
                            <th className="px-4 py-3 text-center">Grand Total</th>
                            <th className="px-4 py-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length > 0 ? (
                            reports.map((purchase, index) => (
                                <tr
                                    key={purchase.id}
                                    className="border-b hover:bg-slate-50"
                                >
                                    <td className="px-4 py-3 text-black">{index + 1}</td>
                                    <td className="px-4 py-3 text-center font-medium text-black">
                                        {purchase.purchase_no}
                                    </td>
                                    <td className="px-4 py-3 text-center text-black">
                                        {purchase.supplier?.name || '—'}
                                    </td>
                                    <td className="px-4 py-3 text-center text-black">
                                        {purchase.supplier_invoice_no || '—'}
                                    </td>
                                    <td className="px-4 py-3 text-center text-black">
                                        {new Date(purchase.purchase_date).toLocaleDateString('en-IN')}
                                    </td>
                                    <td className="px-4 py-3 text-center text-black">
                                        ₹{toNumber(purchase.subtotal).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-center font-semibold text-green-600">
                                        ₹{toNumber(purchase.grand_total).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span
                                            className={`inline-block rounded px-3 py-1 text-xs font-medium ${
                                                purchase.status === 'Received'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : purchase.status === 'Pending'
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : purchase.status === 'Cancelled'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            {purchase.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="py-12 text-center text-gray-500">
                                    No purchase records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
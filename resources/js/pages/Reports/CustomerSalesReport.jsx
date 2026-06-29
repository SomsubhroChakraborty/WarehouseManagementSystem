import { useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PosSalesReport({
    reports = [],
    search = '',
    period = '',
}) {
    const { data, setData, get } = useForm({
        search,
        period,
    });

    const handleSearch = () => {
        get('/reports/customer-sales', { data }, {
            preserveScroll: true,
            replace: true,
        });
    };

    const handleReset = () => {
        get('/reports/customer-sales', {}, {
            preserveScroll: true,
            replace: true,
        });
    };

    // Safe number helper
    const toNumber = (value) => {
        const num = Number(value);
        return isNaN(num) ? 0 : num;
    };

    // Calculate totals and counts
    const {
        totalAmountReceived,
        totalOrders,
        partialCount,
        pendingCount,
    } = reports.reduce(
        (acc, sale) => {
            const invoiceTotal = sale.items?.reduce((sum, item) => {
                return (
                    sum +
                    toNumber(item.quantity) * toNumber(item.price)
                );
            }, 0) || 0;

            acc.totalOrders += 1;

            if (sale.payment_status === 'paid') {
                acc.totalAmountReceived += invoiceTotal;
            } else if (sale.payment_status === 'partial') {
                acc.partialCount += 1;
            } else if (sale.payment_status === 'pending') {
                acc.pendingCount += 1;
            }

            return acc;
        },
        {
            totalAmountReceived: 0,
            totalOrders: 0,
            partialCount: 0,
            pendingCount: 0,
        }
    );

    return (
        <div className="space-y-6 p-6">
            <div className="text-2xl font-bold text-white">
                Customer / Vendor Sales Report
            </div>

            {/* Filters */}
            <div className="flex items-end justify-between">
                <div className="flex items-end gap-3">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Search Customer
                        </label>
                        <Input
                            placeholder="Customer Number / Name..."
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
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <h2 className="mt-2 text-3xl font-bold text-black">
                        {totalOrders}
                    </h2>
                </div>

                <div className="rounded-lg bg-white p-5 shadow">
                    <p className="text-sm text-gray-500">Amount Received</p>
                    <h2 className="mt-2 text-3xl font-bold text-green-600">
                        ₹{totalAmountReceived.toFixed(2)}
                    </h2>
                </div>

                <div className="rounded-lg bg-white p-5 shadow">
                    <p className="text-sm text-gray-500">Partial Orders</p>
                    <h2 className="mt-2 text-3xl font-bold text-yellow-600">
                        {partialCount}
                    </h2>
                </div>

                <div className="rounded-lg bg-white p-5 shadow">
                    <p className="text-sm text-gray-500">Pending Orders</p>
                    <h2 className="mt-2 text-3xl font-bold text-red-600">
                        {pendingCount}
                    </h2>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#0F172B] text-white">
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-center">Invoice</th>
                            <th className="px-4 py-3 text-center">Customer</th>
                            <th className="px-4 py-3 text-center">Items</th>
                            <th className="px-4 py-3 text-center">Total</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {reports.length > 0 ? (
                            reports.map((sale, index) => {
                                const totalAmount =
                                    sale.items?.reduce(
                                        (sum, item) =>
                                            sum +
                                            toNumber(item.quantity) *
                                            toNumber(item.price),
                                        0
                                    ) || 0;

                                return (
                                    <tr
                                        key={sale.id}
                                        className="border-b hover:bg-slate-50"
                                    >
                                        <td className="px-4 py-3 text-black">
                                            {index + 1}
                                        </td>

                                        <td className="px-4 py-3 text-center font-medium text-black">
                                            INV-{sale.id}
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {sale.customer?.name || '—'}
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {sale.items?.length ?? 0}
                                        </td>

                                        <td className="px-4 py-3 text-center font-semibold text-green-600">
                                            ₹{totalAmount.toFixed(2)}
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`inline-block rounded px-2.5 py-1 text-xs font-medium ${
                                                    sale.payment_status === 'paid'
                                                        ? 'bg-green-100 text-green-700'
                                                        : sale.payment_status === 'partial'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {sale.payment_status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {new Date(sale.created_at).toLocaleDateString('en-IN')}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="py-12 text-center text-gray-500"
                                >
                                    No sales found for the selected criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
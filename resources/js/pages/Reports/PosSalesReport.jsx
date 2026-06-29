import { useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PosSalesReport({
    reports = [],
    search = '',
    period = '',
}) {

    const {
        data,
        setData,
        get,
    } = useForm({
        search,
        period,
    });

    const handleSearch = () => {
        get('/reports/pos-sales', data, {
            preserveScroll: true,
            replace: true,
        });
    };

    const handleReset = () => {
        get('/reports/pos-sales', {}, {
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <div className="space-y-6 p-6">

            <div className="text-2xl font-bold text-white">
                POS Sales Report
            </div>

            {/* Filters */}

            <div className="flex items-end justify-between">

                <div className="flex items-end gap-3">

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Search Invoice
                        </label>

                        <Input
                            placeholder="Invoice Number..."
                            value={data.search}
                            onChange={(e) =>
                                setData('search', e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Period
                        </label>

                        <select
                            value={data.period}
                            onChange={(e) =>
                                setData('period', e.target.value)
                            }
                            className="h-10 rounded-md border px-3"
                        >
                            <option value="">All</option>
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    <Button onClick={handleSearch}>
                        Search
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>

                </div>

            </div>

            {/* Summary */}

            <div className="grid grid-cols-3 gap-4">

                <div className="rounded-lg bg-white p-5 shadow">
                    <p className="text-sm text-gray-500">
                        Total Transactions
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-black">
                        {reports.length}
                    </h2>
                </div>

                <div className="rounded-lg bg-white p-5 shadow">
                    <p className="text-sm text-gray-500">
                        Total Sales
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-green-600">
                        ₹
                        {reports
                            .reduce(
                                (sum, sale) =>
                                    sum + Number(sale.grand_total),
                                0
                            )
                            .toFixed(2)}
                    </h2>
                </div>

                <div className="rounded-lg bg-white p-5 shadow">
                    <p className="text-sm text-gray-500">
                        Cash Payments
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-blue-600">
                        {
                            reports.filter(
                                (sale) =>
                                    sale.payment_method === 'Cash'
                            ).length
                        }
                    </h2>
                </div>

            </div>

            {/* Table */}

            <div className="overflow-hidden rounded-lg border bg-white shadow-sm">

                <table className="w-full">

                    <thead>

                        <tr className="bg-[#0F172B] text-white">

                            <th className="px-4 py-3 text-left">
                                #
                            </th>

                            <th className="px-4 py-3 text-center">
                                Invoice
                            </th>

                            <th className="px-4 py-3 text-center">
                                Payment
                            </th>

                            <th className="px-4 py-3 text-center">
                                Subtotal
                            </th>

                            <th className="px-4 py-3 text-center">
                                Discount
                            </th>

                            <th className="px-4 py-3 text-center">
                                Tax
                            </th>

                            <th className="px-4 py-3 text-center">
                                Grand Total
                            </th>

                            <th className="px-4 py-3 text-center">
                                Paid
                            </th>

                            <th className="px-4 py-3 text-center">
                                Date
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {reports.length > 0 ? (

                            reports.map((sale, index) => (

                                <tr
                                    key={sale.id}
                                    className="border-b hover:bg-slate-50"
                                >

                                    <td className="px-4 py-3 text-black">
                                        {index + 1}
                                    </td>

                                    <td className="px-4 py-3 text-center text-black">
                                        {sale.invoice_no}
                                    </td>

                                    <td className="px-4 py-3 text-center text-black">
                                        {sale.payment_method}
                                    </td>

                                    <td className="px-4 py-3 text-center text-black">
                                        ₹{sale.subtotal}
                                    </td>

                                    <td className="px-4 py-3 text-center text-black">
                                        ₹{sale.discount}
                                    </td>

                                    <td className="px-4 py-3 text-center text-black">
                                        ₹{sale.tax}
                                    </td>

                                    <td className="px-4 py-3 text-center font-semibold text-green-600">
                                        ₹{sale.grand_total}
                                    </td>

                                    <td className="px-4 py-3 text-center text-black">
                                        ₹{sale.paid_amount}
                                    </td>

                                    <td className="px-4 py-3 text-center text-black">
                                        {new Date(
                                            sale.created_at
                                        ).toLocaleDateString()}
                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="9"
                                    className="py-6 text-center text-black"
                                >
                                    No POS Sales Found.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}
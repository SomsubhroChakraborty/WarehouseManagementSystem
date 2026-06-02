import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />

            <div className="p-6">
                <div className="space-y-6">

                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Warehouse Dashboard
                        </h1>
                        <p className="text-sm text-slate-500">
                            Warehouse inventory and order overview
                        </p>
                    </div>

                    {/* Statistics */}
                    <div className="flex flex-wrap gap-4">
                        <div className="min-w-[220px] flex-1 rounded-lg border bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <p className="text-sm text-slate-500">Todays Sale</p>
                            <h2 className="mt-2 text-3xl font-bold">0.00</h2>
                        </div>

                        <div className="min-w-[220px] flex-1 rounded-lg border bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <p className="text-sm text-slate-500">Customer</p>
                            <h2 className="mt-2 text-3xl font-bold">55</h2>
                        </div>

                        <div className="min-w-[220px] flex-1 rounded-lg border bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <p className="text-sm text-slate-500">Supplier</p>
                            <h2 className="mt-2 text-3xl font-bold text-amber-600">
                                20
                            </h2>
                        </div>

                        <div className="min-w-[220px] flex-1 rounded-lg border bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <p className="text-sm text-slate-500">Low Stock Items</p>
                            <h2 className="mt-2 text-3xl font-bold text-red-600">
                                18
                            </h2>
                        </div>
                    </div>

                    {/* Inventory Summary */}
                   

                    {/* Recent Orders */}
                    <div className="overflow-hidden rounded-lg border bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <div className="border-b px-5 py-4 dark:border-slate-700">
                            <h2 className="text-lg font-semibold">
                                Recent Orders
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800">
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase">
                                            Order ID
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase">
                                            Customer
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase">
                                            Items
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr className="border-t dark:border-slate-700">
                                        <td className="px-5 py-3">ORD-1001</td>
                                        <td className="px-5 py-3">ABC Traders</td>
                                        <td className="px-5 py-3">15</td>
                                        <td className="px-5 py-3">
                                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700">
                                                Pending
                                            </span>
                                        </td>
                                    </tr>

                                    <tr className="border-t dark:border-slate-700">
                                        <td className="px-5 py-3">ORD-1002</td>
                                        <td className="px-5 py-3">XYZ Pvt Ltd</td>
                                        <td className="px-5 py-3">32</td>
                                        <td className="px-5 py-3">
                                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                                                Completed
                                            </span>
                                        </td>
                                    </tr>

                                    <tr className="border-t dark:border-slate-700">
                                        <td className="px-5 py-3">ORD-1003</td>
                                        <td className="px-5 py-3">Global Store</td>
                                        <td className="px-5 py-3">8</td>
                                        <td className="px-5 py-3">
                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                                                Processing
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
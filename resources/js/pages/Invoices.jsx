import { useState } from 'react';
import { router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Eye, Download } from 'lucide-react';

export default function Invoices({
invoices = [],
filters = {},
}) {


const [search, setSearch] = useState(
    filters.search || ''
);

const [status, setStatus] = useState(
    filters.status || ''
);

const handleFilter = () => {

    router.get('/invoices',
        {
            search,
            status,
        },
        {
            preserveState: true,
            replace: true,
        }
    );
};

return (
    <div className="space-y-6 p-6">

        <div>
            <h1 className="text-2xl font-bold">
                Invoices
            </h1>
        </div>

        <div className="flex item-center justify-between">

            <Input
             className="w-1/3"
                placeholder="Search Customer..."
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
            />

              <div className='flex gap-2'>

            <select 
                value={status}
                onChange={(e) =>
                    setStatus(e.target.value)
                }
                className="border rounded-md px-3 py-2"
                >
                <option value="">
                    All Status
                </option>

                <option value="pending" className='text-black'>
                    Pending
                </option>

                <option value="partial" className='text-black'>
                    Partial
                </option>

                <option value="paid" className='text-black'>
                    Paid
                </option>
            </select>

            <Button
                onClick={handleFilter}
                >
                Filter
            </Button>

                </div>
        </div>

        <div className="overflow-x-auto rounded-md border">

            <table className="w-full">

                <thead>

                    <tr className="border-b bg-muted">

                        <th className="p-3 text-left">
                            Customer
                        </th>

                        <th className="p-3 text-left">
                            Date
                        </th>

                        <th className="p-3 text-left">
                            Payment
                        </th>

                        <th className="p-3 text-left">
                            Status
                        </th>

                        <th className="p-3 text-left">
                            Total Qty
                        </th>

                        <th className="p-3 text-left">
                            Total Amount
                        </th>

                        <th className="p-3 text-left">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {invoices.length === 0 && (

                        <tr>

                            <td
                                colSpan="7"
                                className="p-4 text-center"
                            >
                                No invoices found
                            </td>

                        </tr>

                    )}

                    {invoices.map((invoice) => {

                        const totalAmount =
                            invoice.items?.reduce(
                                (sum, item) =>
                                    sum +
                                    (
                                        Number(
                                            item.quantity
                                        ) *
                                        Number(
                                            item.price
                                        )
                                    ),
                                0
                            ) || 0;

                        const totalQty =
                            invoice.items?.reduce(
                                (sum, item) =>
                                    sum +
                                    Number(
                                        item.quantity
                                    ),
                                0
                            ) || 0;

                        return (

                            <tr
                                key={invoice.id}
                                className="border-b"
                            >

                                <td className="p-3">
                                    {
                                        invoice.customer
                                            ?.name
                                    }
                                </td>

                                <td className="p-3">
                                    {invoice.date}
                                </td>

                                <td className="p-3">
                                    {
                                        invoice.payment
                                    }
                                </td>

                               <td>
    <select
        value={invoice.payment_status}
        onChange={(e) =>
            router.put(
                `/invoices/${invoice.id}/status`,
                {
                    payment_status: e.target.value,
                }
            )
        }
    >
        <option value="pending" className='text-black'>
            Pending
        </option>

        <option value="partial" className='text-black'>
            Partial
        </option>

        <option value="paid" className='text-black'>
            Paid
        </option>
    </select>
</td>   

                                <td className="p-3">
                                    {totalQty}
                                </td>

                                <td className="p-3">
                                    ₹
                                    {totalAmount.toFixed(
                                        2
                                    )}
                                </td>

                                <td className="p-3">

                                    <div className="flex gap-2">

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                window.open(
    `/invoices/${invoice.id}/preview`,
    '_blank'
)
                                            }
                                        >
                                            <Eye className="mr-1 h-4 w-4" />
                                            Preview
                                        </Button>

                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                window.open(
    `/invoices/${invoice.id}/download`
)
                                            }
                                        >
                                            <Download className="mr-1 h-4 w-4" />
                                            Download
                                        </Button>

                                    </div>

                                </td>

                            </tr>

                        );
                    })}

                </tbody>

            </table>

        </div>

    </div>
);


}

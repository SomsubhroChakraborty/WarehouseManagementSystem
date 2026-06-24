import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Plus, Pencil, Trash2, FileText, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export default function Quotations({
    customers = [],
    products = [],
    varients = [],
    quotations = [],
}) {
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        id: '',
        date: '',
        valid: '',
        customer_id: '',
        payment: '',
        note: '',
        items: [
            {
                product_id: '',
                varient_id: '',
                quantity: '',
                price: '',
            },
        ],
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.id) {
            put(`/quotations/${data.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
            });
        } else {
            post('/quotations', {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
            });
        }
    };

    const handleEdit = (quotation) => {
        setData({
            id: quotation.id,
            date: quotation.date,
            valid: quotation.valid,
            customer_id: quotation.customer_id,
            payment: quotation.payment,
            note: quotation.note ?? '',
            items:
                quotation.items?.map((item) => ({
                    product_id: item.product_id,
                    varient_id: item.varient_id,
                    quantity: item.quantity,
                    price: item.price,
                })) ?? [],
        });

        setOpen(true);
    };

    const handleDelete = () => {
        destroy(`/quotations/${data.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                reset();
            },
        });
    };

    const addItem = () => {
        setData('items', [
            ...data.items,
            {
                product_id: '',
                varient_id: '',
                quantity: '',
                price: '',
            },
        ]);
    };

    const removeItem = (index) => {
        setData(
            'items',
            data.items.filter((_, i) => i !== index)
        );
    };

    const updateItem = (index, field, value) => {
        const items = [...data.items];

        items[index][field] = value;

        // If product changes, clear the varient so a stale varient
        // from a different product can't stay selected.
        if (field === 'product_id') {
            items[index].varient_id = '';
        }

        setData('items', items);
    };

    const lineTotal = (item) => {
        const qty = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.price) || 0;
        return qty * price;
    };

    const grandTotal = data.items.reduce(
        (sum, item) => sum + lineTotal(item),
        0
    );

    // Display-only helper — does not touch the underlying date value.
    const formatDate = (value) => {
        if (!value) return '—';
        const d = new Date(value);
        return Number.isNaN(d.getTime())
            ? value
            : d.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
              });
    };

    // Dark, modal-specific styles — the rest of the page keeps its
    // existing dark-themed shell untouched.
    const selectClass =
        'w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 shadow-sm transition-colors focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30';

    const labelClass = 'text-sm font-medium text-slate-300';

    const darkInputClass =
        'border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:border-slate-500 focus-visible:ring-sky-500/30';

    return (
        <div className="p-6">
            <div className="mx-auto max-w-6xl space-y-6">
                {/* Page header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            Quotations
                        </h2>
                        <p className="text-sm text-slate-400">
                            {quotations.length}{' '}
                            {quotations.length === 1
                                ? 'quotation'
                                : 'quotations'}{' '}
                            on file
                        </p>
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="gap-2"
                                onClick={() => reset()}
                            >
                                <Plus className="h-4 w-4" />
                                Add Quotation
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-slate-700 bg-slate-900 text-slate-100">
                            <DialogHeader>
                                <DialogTitle className="text-slate-100">
                                    {data.id
                                        ? 'Edit Quotation'
                                        : 'Create Quotation'}
                                </DialogTitle>

                                <DialogDescription className="text-slate-400">
                                    Enter quotation details
                                </DialogDescription>
                            </DialogHeader>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                {/* Details */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                                        Details
                                    </h3>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <label className={labelClass}>
                                                Date
                                            </label>
                                            <Input
                                                type="date"
                                                className={darkInputClass}
                                                value={data.date}
                                                onChange={(e) =>
                                                    setData(
                                                        'date',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            {errors.date && (
                                                <p className="text-sm text-red-400">
                                                    {errors.date}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className={labelClass}>
                                                Valid Until
                                            </label>
                                            <Input
                                                type="date"
                                                className={darkInputClass}
                                                value={data.valid}
                                                onChange={(e) =>
                                                    setData(
                                                        'valid',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            {errors.valid && (
                                                <p className="text-sm text-red-400">
                                                    {errors.valid}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className={labelClass}>
                                            Customer
                                        </label>
                                        <select
                                            value={data.customer_id}
                                            onChange={(e) =>
                                                setData(
                                                    'customer_id',
                                                    e.target.value
                                                )
                                            }
                                            className={selectClass}
                                        >
                                            <option value="">
                                                Select customer
                                            </option>

                                            {customers.map((customer) => (
                                                <option
                                                    key={customer.id}
                                                    value={customer.id}
                                                >
                                                    {customer.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.customer_id && (
                                            <p className="text-sm text-red-400">
                                                {errors.customer_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <label className={labelClass}>
                                                Payment Terms
                                            </label>
                                            <Input
                                                className={darkInputClass}
                                                placeholder="e.g. 50% advance"
                                                value={data.payment}
                                                onChange={(e) =>
                                                    setData(
                                                        'payment',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className={labelClass}>
                                                Note
                                            </label>
                                            <Input
                                                className={darkInputClass}
                                                placeholder="Optional note"
                                                value={data.note}
                                                onChange={(e) =>
                                                    setData(
                                                        'note',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="space-y-3 border-t border-slate-700 pt-5">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                                            Items
                                        </h3>

                                        <Button
                                            type="button"
                                            size="sm"
                                            className="gap-1.5"
                                            onClick={addItem}
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            Add Item
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {data.items.map((item, index) => {
                                            const selectedProduct =
                                                products.find(
                                                    (product) =>
                                                        String(
                                                            product.id
                                                        ) ===
                                                        String(
                                                            item.product_id
                                                        )
                                                );

                                            const filteredVarients =
                                                selectedProduct?.varients ||
                                                [];

                                            return (
                                                <div
                                                    key={index}
                                                    className="space-y-3 rounded-lg border border-slate-700 bg-slate-800/60 p-4"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium text-slate-500">
                                                            Item{' '}
                                                            {index + 1}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeItem(
                                                                    index
                                                                )
                                                            }
                                                            className="rounded-md p-1 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                                                            aria-label={`Remove item ${index + 1}`}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                                                        <select
                                                            value={
                                                                item.product_id
                                                            }
                                                            onChange={(e) =>
                                                                updateItem(
                                                                    index,
                                                                    'product_id',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={
                                                                selectClass
                                                            }
                                                        >
                                                            <option value="">
                                                                Select
                                                                product
                                                            </option>

                                                            {products.map(
                                                                (product) => (
                                                                    <option
                                                                        key={
                                                                            product.id
                                                                        }
                                                                        value={
                                                                            product.id
                                                                        }
                                                                    >
                                                                        {
                                                                            product.name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>

                                                        <select
                                                            value={
                                                                item.varient_id
                                                            }
                                                            onChange={(e) =>
                                                                updateItem(
                                                                    index,
                                                                    'varient_id',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={
                                                                selectClass
                                                            }
                                                        >
                                                            <option value="">
                                                                Select
                                                                variant
                                                            </option>

                                                            {filteredVarients.map(
                                                                (varient) => (
                                                                    <option
                                                                        key={
                                                                            varient.id
                                                                        }
                                                                        value={
                                                                            varient.id
                                                                        }
                                                                    >
                                                                        {
                                                                            varient.name
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>

                                                        <Input
                                                            type="number"
                                                            placeholder="Qty"
                                                            className={
                                                                darkInputClass
                                                            }
                                                            value={
                                                                item.quantity
                                                            }
                                                            onChange={(e) =>
                                                                updateItem(
                                                                    index,
                                                                    'quantity',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />

                                                        <Input
                                                            type="number"
                                                            placeholder="Price"
                                                            className={
                                                                darkInputClass
                                                            }
                                                            value={item.price}
                                                            onChange={(e) =>
                                                                updateItem(
                                                                    index,
                                                                    'price',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="text-right text-sm text-slate-400">
                                                        Line total:{' '}
                                                        <span className="font-semibold text-slate-100">
                                                            {lineTotal(
                                                                item
                                                            ).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex items-center justify-end gap-2 border-t border-slate-700 pt-3">
                                        <span className="text-sm font-medium text-slate-400">
                                            Grand Total
                                        </span>
                                        <span className="text-lg font-bold text-slate-100">
                                            {grandTotal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        varient="outline"
                                        className="border-slate-700 text-slate-200 hover:bg-slate-800"
                                        onClick={() => setOpen(false)}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing ? 'Saving…' : 'Save'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#0F172B] text-sm font-medium text-white">
                                <th className="p-3">#</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Customer</th>
                                <th className="p-3">Payment</th>
                                <th className="p-3">Total Amount</th>
                                <th className="p-3 text-right">Action</th>
                            </tr>
                        </thead>

                       <tbody>
    {quotations.length === 0 ? (
        <tr>
            <td
                colSpan={6}
                className="px-3 py-12 text-center"
            >
                <div className="flex flex-col items-center gap-2 text-slate-400">
                    <FileText className="h-8 w-8" />
                    <p className="text-sm font-medium text-slate-500">
                        No quotations yet
                    </p>
                    <p className="text-sm">
                        Click "Add Quotation" to create your first one.
                    </p>
                </div>
            </td>
        </tr>
    ) : (
        quotations.map((quotation, index) => {
            const totalAmount =
                quotation.items?.reduce(
                    (sum, item) =>
                        sum +
                        Number(item.quantity || 0) *
                            Number(item.price || 0),
                    0
                ) || 0;

            return (
                <tr
                    key={quotation.id}
                    className="border-b border-slate-100 text-sm text-slate-800 transition-colors last:border-b-0 hover:bg-slate-50"
                >
                    <td className="p-3 text-slate-400">
                        {index + 1}
                    </td>

                    <td className="p-3">
                        {formatDate(quotation.date)}
                    </td>

                    <td className="p-3 font-medium text-slate-900">
                        {quotation.customer?.name ?? '—'}
                    </td>

                    <td className="p-3 text-slate-600">
                        {quotation.payment || '—'}
                    </td>

                    <td className="p-3 font-semibold">
                        ₹ {totalAmount.toFixed(2)}
                    </td>

                    <td className="p-3">
                        <div className="flex justify-end gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-white"
                                onClick={() =>
                                    handleEdit(quotation)
                                }
                            >
                                <Pencil className="h-3.5 w-3.5 text-white" />
                                Edit
                            </Button>

                            <Button
                                size="sm"
                                variant="destructive"
                                className="gap-1.5"
                                onClick={() => {
                                    setData(
                                        'id',
                                        quotation.id
                                    );
                                    setDeleteOpen(true);
                                }}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                            </Button>
                        </div>
                    </td>
                </tr>
            );
        })
    )}
</tbody>
                    </table>
                </div>

                {/* Delete confirmation */}
                <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <DialogContent className="border-slate-700 bg-slate-900 text-slate-100">
                        <DialogHeader>
                            <DialogTitle className="text-slate-100">
                                Delete Quotation
                            </DialogTitle>
                            <DialogDescription className="text-slate-400">
                                This action can't be undone. The quotation
                                will be permanently removed.
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                            <Button
                                varient="outline"
                                className="border-slate-700 text-slate-200 hover:bg-slate-800"
                                onClick={() => setDeleteOpen(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                varient="destructive"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
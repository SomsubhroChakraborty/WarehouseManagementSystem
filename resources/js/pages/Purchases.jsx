import { useEffect, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, PackageSearch, X, Search } from 'lucide-react';

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

const STATUS_OPTIONS = ['Pending', 'Received', 'Cancelled'];

const emptyPurchase = {
    id: null,
    supplier_id: '',
    supplier_invoice_no: '',
    purchase_date: '',
    remarks: '',
    status: 'Pending',
    subtotal: 0,
    discount: 0,
    tax: 0,
    shipping_charge: 0,
    grand_total: 0,
    items: [
        {
            id: null,
            product_id: '',
            varient_id: '',
            quantity: 1,
            purchase_price: 0,
            discount: 0,
            tax: 0,
            total: 0,
        },
    ],
};

// item_total = (quantity * purchase_price) - discount - tax
const calcItemTotal = (item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.purchase_price) || 0;
    const discount = parseFloat(item.discount) || 0;
    const tax = parseFloat(item.tax) || 0;

    return qty * price - discount - tax;
};

export default function Purchases({
    purchases,
    suppliers = [],
    products = [],
    varients = [],
    filters = {},
}) {
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');

    const purchaseRows = purchases?.data ?? [];

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm(emptyPurchase);

    // Recalculate subtotal + grand_total whenever items or the
    // purchase-level discount/tax/shipping_charge change.
    useEffect(() => {
        const subtotal = data.items.reduce(
            (sum, item) => sum + calcItemTotal(item),
            0
        );

        const purchaseDiscount = parseFloat(data.discount) || 0;
        const purchaseTax = parseFloat(data.tax) || 0;
        const shipping = parseFloat(data.shipping_charge) || 0;

        const grandTotal = subtotal - purchaseDiscount + purchaseTax + shipping;

        if (subtotal !== data.subtotal || grandTotal !== data.grand_total) {
            setData((prev) => ({
                ...prev,
                subtotal,
                grand_total: grandTotal,
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.items, data.discount, data.tax, data.shipping_charge]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.id) {
            put(`/purchases/${data.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setData(emptyPurchase);
                    setOpen(false);
                },
            });
        } else {
            post('/purchases', {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setData(emptyPurchase);
                    setOpen(false);
                },
            });
        }
    };

    const openCreate = () => {
        reset();
        setData(emptyPurchase);
        setOpen(true);
    };

  const handleEdit = (purchase) => {
    setData({
        id: purchase.id,
        supplier_id: purchase.supplier_id ?? '',
        supplier_invoice_no: purchase.supplier_invoice_no ?? '',
        purchase_date: purchase.purchase_date?.substring(0, 10) ?? '',
        remarks: purchase.remarks ?? '',
        status: purchase.status ?? 'Pending',
        subtotal: purchase.subtotal ?? 0,
        discount: purchase.discount ?? 0,
        tax: purchase.tax ?? 0,
        shipping_charge: purchase.shipping_charge ?? 0,
        grand_total: purchase.grand_total ?? 0,
        items: purchase.items?.map((item) => ({  // ← Changed from purchase_items
            id: item.id,
            product_id: item.varient?.product_id ?? item.product_id,
            varient_id: item.varient_id,
            quantity: item.quantity,
            purchase_price: item.purchase_price,
            discount: item.discount ?? 0,
            tax: item.tax ?? 0,
            total: item.total ?? calcItemTotal(item),
        })) ?? [],
    });

    setOpen(true);
};
    const closeModal = () => {
        reset();
        setData(emptyPurchase);
        setOpen(false);
    };

    const handleDelete = () => {
        destroy(`/purchases/${data.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                reset();
                setData(emptyPurchase);
            },
        });
    };

    const addItem = () => {
        setData('items', [
            ...data.items,
            {
                id: null,
                product_id: '',
                varient_id: '',
                quantity: 1,
                purchase_price: 0,
                discount: 0,
                tax: 0,
                total: 0,
            },
        ]);
    };

    const removeItem = (index) => {
        // Always keep at least one item row.
        if (data.items.length === 1) {
            return;
        }

        setData(
            'items',
            data.items.filter((_, i) => i !== index)
        );
    };

    const updateItem = (index, field, value) => {
        const items = [...data.items];

        items[index] = { ...items[index], [field]: value };

        if (field === 'product_id') {
            // Changing the product invalidates the previously chosen
            // varient and the purchase price that came with it.
            items[index].varient_id = '';
            items[index].purchase_price = 0;
        }

        if (field === 'varient_id') {
            const varient = varients.find(
                (v) => String(v.id) === String(value)
            );

            if (varient?.purchase_price != null) {
                items[index].purchase_price = varient.purchase_price;
            }
        }

        items[index].total = calcItemTotal(items[index]);

        setData('items', items);
    };

    const lineTotal = (item) => calcItemTotal(item);

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

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            '/purchases',
            { search },
            { preserveState: true, replace: true }
        );
    };

    const goToPage = (url) => {
        if (!url) return;
        router.get(url, { search }, { preserveState: true });
    };

    const selectClass =
        'w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 shadow-sm transition-colors focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30';

    const labelClass = 'text-sm font-medium text-slate-300';

    const darkInputClass =
        'border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:border-slate-500 focus-visible:ring-sky-500/30';

    const readOnlyInputClass =
        'border-slate-700 bg-slate-900 text-slate-300 placeholder:text-slate-500 cursor-not-allowed';

    const itemsValid = data.items.every(
        (item) =>
            item.product_id &&
            item.varient_id &&
            Number(item.quantity) > 0 &&
            Number(item.purchase_price) > 0
    );

    const isSaveDisabled =
        processing ||
        !data.supplier_id ||
        !data.supplier_invoice_no ||
        !data.purchase_date ||
        !data.status ||
        data.items.length === 0 ||
        !itemsValid;

    return (
        <div className="p-6">
            <div className="mx-auto max-w-6xl space-y-6">
                {/* Page header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            Purchases
                        </h2>
                        <p className="text-sm text-slate-400">
                            {purchases?.total ?? purchaseRows.length}{' '}
                            {(purchases?.total ?? purchaseRows.length) === 1
                                ? 'purchase'
                                : 'purchases'}{' '}
                            on file
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Search purchases"
                                    className="w-56 pl-8"
                                />
                            </div>
                            <Button type="submit" varient="outline">
                                Search
                            </Button>
                        </form>

                        <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
        <Button className="gap-2" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Purchase
        </Button>
    </DialogTrigger>

    <DialogContent className="max-w-7xl h-[95vh] max-h-[95vh] p-0 border-slate-700 bg-slate-900 text-slate-100 overflow-hidden flex flex-col">
        
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-700">
            <DialogTitle className="text-2xl text-slate-100">
                {data.id ? 'Edit Purchase' : 'Create New Purchase'}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
                Enter purchase details and items
            </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form 
            id="purchase-form"
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col overflow-hidden"
        >
            <div className="flex-1 overflow-auto p-6 space-y-8">
                
                {/* Purchase Details */}
                <div className="space-y-5">
                    <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2">
                        Purchase Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="space-y-1.5">
                            <label className={labelClass}>Supplier</label>
                            <select
                                value={data.supplier_id}
                                onChange={(e) => setData('supplier_id', e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Select supplier</option>
                                {suppliers.map((supplier) => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>
                            {errors.supplier_id && (
                                <p className="text-sm text-red-400">{errors.supplier_id}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClass}>Invoice No</label>
                            <Input
                                className={darkInputClass}
                                placeholder="INV-00123"
                                value={data.supplier_invoice_no}
                                onChange={(e) => setData('supplier_invoice_no', e.target.value)}
                            />
                            {errors.supplier_invoice_no && (
                                <p className="text-sm text-red-400">{errors.supplier_invoice_no}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClass}>Purchase Date</label>
                            <Input
                                type="date"
                                className={darkInputClass}
                                value={data.purchase_date}
                                onChange={(e) => setData('purchase_date', e.target.value)}
                            />
                            {errors.purchase_date && (
                                <p className="text-sm text-red-400">{errors.purchase_date}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClass}>Status</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className={selectClass}
                            >
                                {STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className={labelClass}>Remarks</label>
                        <Input
                            className={darkInputClass}
                            placeholder="Optional remarks or notes..."
                            value={data.remarks}
                            onChange={(e) => setData('remarks', e.target.value)}
                        />
                    </div>
                </div>

                {/* Items Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-slate-200">Items</h3>
                        <Button type="button" size="sm" className="gap-2" onClick={addItem}>
                            <Plus className="h-4 w-4" />
                            Add Item
                        </Button>
                    </div>

                    <div className="border border-slate-700 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-800 sticky top-0 z-10">
                                    <tr className="text-xs uppercase tracking-wide text-slate-400">
                                        <th className="p-4 text-left">Product</th>
                                        <th className="p-4 text-left">Variant</th>
                                        <th className="p-4 text-right">Qty</th>
                                        <th className="p-4 text-right">Purchase Price</th>
                                        <th className="p-4 text-right">Discount</th>
                                        <th className="p-4 text-right">Tax</th>
                                        <th className="p-4 text-right">Total</th>
                                        <th className="p-4 w-12"></th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-700">
                                    {data.items.map((item, index) => {
                                        const filteredVarients = varients.filter(
                                            (v) => String(v.product_id) === String(item.product_id)
                                        );

                                        return (
                                            <tr key={index} className="hover:bg-slate-800/50 transition-colors">
                                                <td className="p-4 align-top">
                                                    <select
                                                        value={item.product_id}
                                                        onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                                                        className={selectClass}
                                                    >
                                                        <option value="">Select Product</option>
                                                        {products.map((product) => (
                                                            <option key={product.id} value={product.id}>
                                                                {product.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>

                                                <td className="p-4 align-top">
                                                    <select
                                                        value={item.varient_id}
                                                        onChange={(e) => updateItem(index, 'varient_id', e.target.value)}
                                                        className={selectClass}
                                                        disabled={!item.product_id}
                                                    >
                                                        <option value="">Select Variant</option>
                                                        {filteredVarients.map((varient) => (
                                                            <option key={varient.id} value={varient.id}>
                                                                {varient.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>

                                                <td className="p-4 align-top">
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        className={darkInputClass}
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                    />
                                                </td>

                                                <td className="p-4 align-top">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        className={darkInputClass}
                                                        value={item.purchase_price}
                                                        onChange={(e) => updateItem(index, 'purchase_price', e.target.value)}
                                                    />
                                                </td>

                                                <td className="p-4 align-top">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        className={darkInputClass}
                                                        value={item.discount}
                                                        onChange={(e) => updateItem(index, 'discount', e.target.value)}
                                                    />
                                                </td>

                                                <td className="p-4 align-top">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        className={darkInputClass}
                                                        value={item.tax}
                                                        onChange={(e) => updateItem(index, 'tax', e.target.value)}
                                                    />
                                                </td>

                                                <td className="p-4 align-top text-right font-semibold text-slate-100 whitespace-nowrap">
                                                    ₹ {lineTotal(item).toFixed(2)}
                                                </td>

                                                <td className="p-4 align-top text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        disabled={data.items.length === 1}
                                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-200 mb-5">Summary</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-1.5">
                            <label className={labelClass}>Subtotal</label>
                            <Input
                                type="number"
                                readOnly
                                className={readOnlyInputClass}
                                value={Number(data.subtotal).toFixed(2)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>Discount</label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                className={darkInputClass}
                                value={data.discount}
                                onChange={(e) => setData('discount', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>Tax</label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                className={darkInputClass}
                                value={data.tax}
                                onChange={(e) => setData('tax', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>Shipping Charge</label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                className={darkInputClass}
                                value={data.shipping_charge}
                                onChange={(e) => setData('shipping_charge', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-700 flex justify-between items-center">
                        <span className="text-xl text-slate-400">Grand Total</span>
                        <span className="text-4xl font-bold text-emerald-400">
                            ₹ {Number(data.grand_total).toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-700 p-6 bg-slate-950 flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    className="border-slate-700 text-slate-200 hover:bg-slate-800 px-8"
                    onClick={closeModal}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={isSaveDisabled}
                    className="px-10"
                >
                    {processing ? 'Saving...' : data.id ? 'Update Purchase' : 'Create Purchase'}
                </Button>
            </div>
        </form>
    </DialogContent>
</Dialog>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#0F172B] text-sm font-medium text-white">
                                <th className="p-3">#</th>
                                <th className="p-3">Invoice No</th>
                                <th className="p-3">Purchase Date</th>
                                <th className="p-3">Supplier</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Grand Total</th>
                                <th className="p-3 text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {purchaseRows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-3 py-12 text-center text-slate-400"
                                    >
                                        <div className="flex flex-col items-center gap-2">
                                            <PackageSearch className="h-6 w-6" />
                                            No purchases found
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                purchaseRows.map((purchase, index) => (
                                    <tr
                                        key={purchase.id}
                                        className="border-b border-slate-100 text-sm text-slate-800 transition-colors last:border-b-0 hover:bg-slate-50"
                                    >
                                        <td className="p-3 align-top text-slate-400">
                                            {index + 1}
                                        </td>

                                        <td className="p-3 align-top font-medium text-slate-900">
                                            {purchase.supplier_invoice_no ?? '—'}
                                        </td>

                                        <td className="p-3 align-top">
                                            {formatDate(
                                                purchase.purchase_date
                                            )}
                                        </td>

                                        <td className="p-3 align-top font-medium text-slate-900">
                                            {purchase.supplier?.name ?? '—'}
                                        </td>

                                        <td className="p-3 align-top">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                    purchase.status ===
                                                    'Received'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : purchase.status ===
                                                          'Cancelled'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                }`}
                                            >
                                                {purchase.status ?? '—'}
                                            </span>
                                        </td>

                                        <td className="p-3 align-top font-semibold">
                                            ₹{' '}
                                            {Number(
                                                purchase.grand_total ?? 0
                                            ).toFixed(2)}
                                        </td>

                                        <td className="p-3 align-top">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    varient="outline"
                                                    className="gap-1.5"
                                                    onClick={() =>
                                                        handleEdit(purchase)
                                                    }
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                    Edit
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    varient="destructive"
                                                    className="gap-1.5"
                                                    onClick={() => {
                                                        setData(
                                                            'id',
                                                            purchase.id
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
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {purchases?.links && purchases.links.length > 3 && (
                        <div className="flex flex-wrap items-center justify-end gap-1 border-t border-slate-100 p-3">
                            {purchases.links.map((link, index) => (
                                <button
                                    key={index}
                                    disabled={!link.url}
                                    onClick={() => goToPage(link.url)}
                                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                                        link.active
                                            ? 'bg-slate-900 text-white'
                                            : link.url
                                            ? 'text-slate-600 hover:bg-slate-100'
                                            : 'cursor-not-allowed text-slate-300'
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Delete confirmation */}
                <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <DialogContent className="border-slate-700 bg-slate-900 text-slate-100">
                        <DialogHeader>
                            <DialogTitle className="text-slate-100">
                                Delete Purchase
                            </DialogTitle>
                            <DialogDescription className="text-slate-400">
                                This action can't be undone. The purchase
                                and its items will be permanently removed.
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
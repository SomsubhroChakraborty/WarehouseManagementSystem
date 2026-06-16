import { useState } from 'react';
import { useForm } from '@inertiajs/react';

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

export default function Stock({ stocks = [], varients = [] }) {
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy, // Extracted destroy from useForm
        processing,
        errors,
        reset,
    } = useForm({
        id: '', // Track ID for editing transitions
        product_id: '',
        varient_id: '',
        quantity: '',
        operation: 'add',
        stock_received_at: '',

    });

    // Extract unique products out of our varients data prop
    const products = Array.from(
        new Map(varients.map(v => [v.product?.id, v.product])).values()
    ).filter(Boolean);

    // Dynamic filtering of varients matching the currently selected product
    const filteredvarients = varients.filter(
        (v) => String(v.product_id) === String(data.product_id)
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.id) {
            // Dynamic routing switch to update endpoint
            put(`/stock/${data.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
            });
        } else {
            post('/stock', {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
            });
        }
    };

    const handleEdit = (stock) => {
        setData({
            id: stock.id,
            product_id: stock.varient?.product_id || '',
            varient_id: stock.varient_id,
            quantity: stock.quantity,
            operation: 'add', 
            stock_received_at: stock.stock_received_at
            ? stock.stock_received_at.slice(0, 16)
            : '',
        });

        setOpen(true);
    };

    const handleDelete = () => {
        destroy(`/stock/${data.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                reset();
            },
        });
    };

    return (
        <div className="space-y-6 p-6">
            <div className="font-bold text-white text-xl">
                Stock Management
            </div>

            <div className="flex justify-end">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => reset()}>
                            Add Stock
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {data.id ? 'Edit Stock' : 'Create Stock'}
                            </DialogTitle>

                            <DialogDescription>
                                Enter stock information.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Product
                                </label>

                                <select
                                    className="w-full rounded-md border p-2 "
                                    value={data.product_id}
                                    onChange={(e) => {
                                        setData((oldData) => ({
                                            ...oldData,
                                            product_id: e.target.value,
                                            varient_id: '', // Instantly wipe variant choice on change
                                        }));
                                    }}
                                >
                                    <option value="" className='text-black'>Select Product</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id} className='text-black'>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Variant
                                </label>

                                <select
                                    className="w-full rounded-md border p-2"
                                    value={data.varient_id}
                                    disabled={!data.product_id}
                                    onChange={(e) => setData('varient_id', e.target.value)}
                                >
                                    <option value="" className='text-black'>Select Variant</option>
                                    {filteredvarients.map((variant) => (
                                        <option key={variant.id} value={variant.id} className='text-black'>
                                            {variant.name} - {variant.color} - {variant.size} ({variant.sku})
                                        </option>
                                    ))}
                                </select>

                                {errors.varient_id && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.varient_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Stock Action
                                </label>

                                <select
                                    className="w-full rounded-md border p-2"
                                    value={data.operation}
                                    onChange={(e) => setData('operation', e.target.value)}
                                >
                                    <option value="add" className='text-black'>Add Stock</option>
                                    <option value="remove" className='text-black'>Remove Stock</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Quantity
                                </label>

                                <Input
                                    type="number"
                                    min="1"
                                    placeholder="Enter quantity"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                />

                                {errors.quantity && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.quantity}
                                    </p>
                                )}
                                
                            </div>
                            <div>
    <label className="mb-2 block text-sm font-medium">
        Stock Received Date & Time
    </label>

    <Input
        type="datetime-local"
        value={data.stock_received_at}
        onChange={(e) =>
            setData('stock_received_at', e.target.value)
        }
    />

    {errors.stock_received_at && (
        <p className="mt-1 text-sm text-red-500">
            {errors.stock_received_at}
        </p>
    )}
</div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>

                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Adjustment'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#0F172B] text-white text-left">
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Product</th>
                            <th className="px-4 py-3">Variant</th>
                            <th className="px-4 py-3">SKU</th>
                            <th className="px-4 py-3">Color</th>
                            <th className="px-4 py-3">Size</th>
                            <th className="px-4 py-3">Quantity</th>
                            <th className="px-4 py-3">Received At</th>
                            <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {stocks.length > 0 ? (
                            stocks.map((stock, index) => (
                                <tr key={stock.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 text-black">{index + 1}</td>
                                    <td className="px-4 py-3 text-black">
                                        {stock.varient?.product?.name || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-black">
                                        {stock.varient?.name || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-black">
                                        {stock.varient?.sku || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-black">
                                        {stock.varient?.color || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-black">
                                        {stock.varient?.size || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-black">{stock.quantity}</td>
                                    <td className="px-4 py-3 text-black">
    {stock.stock_received_at
        ? new Date(stock.stock_received_at).toLocaleString()
        : 'N/A'}
</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(stock)}
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => {
                                                    setData('id', stock.id);
                                                    setDeleteOpen(true);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="py-6 text-center text-black">
                                    No stock found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Stock</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
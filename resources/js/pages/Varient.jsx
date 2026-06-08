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

export default function Varient({
    varients = { data: [] },
    products = [],
    search = '',
}) {
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        get,
        processing,
        errors,
        reset,
    } = useForm({
        id: '',
        name: '',
        product_id: '',
        sku: '',
        price: '',
        sale_price: '',
        stock: '',
        size: '',
        color: '',
        weight: '',
        barcode: '',
        search: search ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.id) {
            put(`/varient/${data.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
            });
        } else {
            post('/varient', {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
            });
        }
    };

    const handleEdit = (varient) => {
        setData({
            id: varient.id,
            name: varient.name ?? '',
            product_id: varient.product_id ?? '',
            sku: varient.sku ?? '',
            price: varient.price ?? '',
            sale_price: varient.sale_price ?? '',
            stock: varient.stock ?? '',
            size: varient.size ?? '',
            color: varient.color ?? '',
            weight: varient.weight ?? '',
            barcode: varient.barcode ?? '',
            search: data.search,
        });

        setOpen(true);
    };

    const handleDelete = () => {
        destroy(`/varient/${data.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                reset('id');
            },
        });
    };

    const handleSearch = () => {
        get(
            '/varient',
            {
                data: { search: data.search },
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const handleReset = () => {
        setData('search', '');

        get(
            '/varient',
            {
                data: {},
                preserveScroll: true,
                replace: true,
            }
        );
    };

    return (
        <div className="space-y-6 p-6">
            <div className="text-xl font-bold text-white">
                Variant List
            </div>

            <div className="flex items-end justify-between">
                <div className="flex items-end gap-2">
                    <Input
                        placeholder="Search variant..."
                        value={data.search ?? ''}
                        onChange={(e) =>
                            setData('search', e.target.value)
                        }
                    />

                    <Button onClick={handleSearch}>
                        Search
                    </Button>

                    {search && (
                        <Button
                            variant="destructive"
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                    )}
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => reset()}
                        >
                            Add Variant
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-h-[90vh] overflow-y-auto max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {data.id
                                    ? 'Edit Variant'
                                    : 'Create Variant'}
                            </DialogTitle>

                            <DialogDescription>
                                Enter variant details.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div>
                                <Input
                                    placeholder="Variant Name"
                                    value={data.name ?? ''}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <select
                                    value={data.product_id ?? ''}
                                    onChange={(e) => setData('product_id', e.target.value)}
                                    className="w-full rounded-md border px-3 py-2 bg-transparent text-white"
                                >
                                    <option value="" className="text-black">
                                        Select Product
                                    </option>
                                    {products.map((product) => (
                                        <option
                                            key={product.id}
                                            value={product.id}
                                            className="text-black"
                                        >
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.product_id && (
                                    <p className="text-sm text-red-500 mt-1">{errors.product_id}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    placeholder="SKU"
                                    value={data.sku ?? ''}
                                    onChange={(e) => setData('sku', e.target.value)}
                                />
                                <Input
                                    placeholder="Barcode"
                                    value={data.barcode ?? ''}
                                    onChange={(e) => setData('barcode', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    type="number"
                                    placeholder="Price"
                                    value={data.price ?? ''}
                                    onChange={(e) => setData('price', e.target.value)}
                                />
                                <Input
                                    type="number"
                                    placeholder="Sale Price"
                                    value={data.sale_price ?? ''}
                                    onChange={(e) => setData('sale_price', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    type="number"
                                    placeholder="Stock"
                                    value={data.stock ?? ''}
                                    onChange={(e) => setData('stock', e.target.value)}
                                />
                                <Input
                                    placeholder="Size"
                                    value={data.size ?? ''}
                                    onChange={(e) => setData('size', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    placeholder="Color"
                                    value={data.color ?? ''}
                                    onChange={(e) => setData('color', e.target.value)}
                                />
                                <Input
                                    placeholder="Weight"
                                    value={data.weight ?? ''}
                                    onChange={(e) => setData('weight', e.target.value)}
                                />
                            </div>

                            <DialogFooter className="pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                >
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#0F172B] text-white">
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Variant Name</th>
                            <th className="px-4 py-3">Product</th>
                            <th className="px-4 py-3">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {varients?.data?.length > 0 ? (
                            varients.data.map((varient, index) => (
                                <tr
                                    key={varient.id}
                                    className="border-b"
                                >
                                    <td className="px-4 py-3 text-center text-black">
                                        {index + 1}
                                    </td>

                                    <td className="px-4 py-3 text-center text-black">
                                        {varient.name}
                                    </td>

                                    <td className="px-4 py-3 text-center text-black">
                                        {varient.product?.name || '-'}
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(varient)}
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => {
                                                    setData('id', varient.id);
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
                                <td
                                    colSpan="4"
                                    className="py-8 text-center text-gray-500 font-medium"
                                >
                                    No Variants Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Dialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Delete Variant
                        </DialogTitle>

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

                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
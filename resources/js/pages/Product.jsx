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

export default function Product({
    products = { data: [] },
    brands = [],
    categories = [],
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
        brand_id: '',
        product_category_id: '',
        search: search ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.id) {
            put(`/product/${data.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    reset(
                        'id',
                        'name',
                        'brand_id',
                        'product_category_id'
                    );
                    setOpen(false);
                },
            });
        } else {
            post('/product', {
                preserveScroll: true,
                onSuccess: () => {
                    reset(
                        'id',
                        'name',
                        'brand_id',
                        'product_category_id'
                    );
                    setOpen(false);
                },
            });
        }
    };

    const handleEdit = (product) => {
        setData({
            id: product.id,
            name: product.name ?? '',
            brand_id: product.brand_id ?? '',
            product_category_id:
                product.product_category_id ?? '',
            search: data.search,
        });

        setOpen(true);
    };

    const handleDelete = () => {
        destroy(`/product/${data.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                reset('id');
            },
        });
    };

    const handleSearch = () => {
        get(
            '/product',
            {
                search: data.search,
            },
            {
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const handleReset = () => {
        setData('search', '');

        get(
            '/product',
            {},
            {
                preserveScroll: true,
                replace: true,
            }
        );
    };

    return (
        <div className="space-y-6 p-6">
            <div className="text-xl font-bold text-white">
                Product List
            </div>

            <div className="flex items-end justify-between">
                <div className="flex items-end gap-2">
                    <Input
                        placeholder="Search product..."
                        value={data.search ?? ''}
                        onChange={(e) =>
                            setData(
                                'search',
                                e.target.value
                            )
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
                            onClick={() =>
                                reset(
                                    'id',
                                    'name',
                                    'brand_id',
                                    'product_category_id'
                                )
                            }
                        >
                            Add Product
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {data.id
                                    ? 'Edit Product'
                                    : 'Create Product'}
                            </DialogTitle>

                            <DialogDescription>
                                Enter product details.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <Input
                                placeholder="Product Name"
                                value={data.name ?? ''}
                                onChange={(e) =>
                                    setData(
                                        'name',
                                        e.target.value
                                    )
                                }
                            />

                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}

                            <select
                                value={data.brand_id ?? ''}
                                onChange={(e) =>
                                    setData(
                                        'brand_id',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-md border px-3 py-2"
                            >
                                <option
                                    value=""
                                    className="text-black"
                                >
                                    Select Brand
                                </option>

                                {brands.map((brand) => (
                                    <option
                                        key={brand.id}
                                        value={brand.id}
                                        className="text-black"
                                    >
                                        {brand.name}
                                    </option>
                                ))}
                            </select>

                            {errors.brand_id && (
                                <p className="text-sm text-red-500">
                                    {errors.brand_id}
                                </p>
                            )}

                            <select
                                value={
                                    data.product_category_id ??
                                    ''
                                }
                                onChange={(e) =>
                                    setData(
                                        'product_category_id',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-md border px-3 py-2"
                            >
                                <option
                                    value=""
                                    className="text-black"
                                >
                                    Select Category
                                </option>

                                {categories.map(
                                    (category) => (
                                        <option
                                            key={
                                                category.id
                                            }
                                            value={
                                                category.id
                                            }
                                            className="text-black"
                                        >
                                            {
                                                category.name
                                            }
                                        </option>
                                    )
                                )}
                            </select>

                            {errors.product_category_id && (
                                <p className="text-sm text-red-500">
                                    {
                                        errors.product_category_id
                                    }
                                </p>
                            )}

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setOpen(false)
                                    }
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={
                                        processing
                                    }
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
                            <th className="px-4 py-3">
                                #
                            </th>
                            <th className="px-4 py-3">
                                Product Name
                            </th>
                            <th className="px-4 py-3">
                                Brand
                            </th>
                            <th className="px-4 py-3">
                                Category
                            </th>
                            <th className="px-4 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {products?.data?.length >
                        0 ? (
                            products.data.map(
                                (
                                    product,
                                    index
                                ) => (
                                    <tr
                                        key={
                                            product.id
                                        }
                                        className="border-b"
                                    >
                                        <td className="px-4 py-3 text-center text-black">
                                            {index +
                                                1}
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {
                                                product.name
                                            }
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {product
                                                .brand
                                                ?.name ||
                                                '-'}
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {product
                                                .productCategory?.name ||'-'}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleEdit(
                                                            product
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => {
                                                        setData(
                                                            'id',
                                                            product.id
                                                        );
                                                        setDeleteOpen(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="py-8 text-center text-gray-500 font-medium"
                                >
                                    No Products Found
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
                            Delete Product
                        </DialogTitle>

                        <DialogDescription>
                            This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setDeleteOpen(false)
                            }
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
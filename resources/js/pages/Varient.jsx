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
        search: search ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.id) {
            put(`/varient/${data.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    reset('id', 'name', 'product_id');
                    setOpen(false);
                },
            });
        } else {
            post('/varient', {
                preserveScroll: true,
                onSuccess: () => {
                    reset('id', 'name', 'product_id');
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
            '/varient',
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
                Varient List
            </div>

            <div className="flex items-end justify-between">
                <div className="flex items-end gap-2">
                    <Input
                        placeholder="Search varient..."
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
                            onClick={() =>
                                reset(
                                    'id',
                                    'name',
                                    'product_id'
                                )
                            }
                        >
                            Add Varient
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {data.id
                                    ? 'Edit Varient'
                                    : 'Create Varient'}
                            </DialogTitle>

                            <DialogDescription>
                                Enter varient details.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <Input
                                placeholder="Varient Name"
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
                                value={data.product_id ?? ''}
                                onChange={(e) =>
                                    setData(
                                        'product_id',
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-md border px-3 py-2"
                            >
                                <option
                                    value=""
                                    className="text-black"
                                >
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
                                <p className="text-sm text-red-500">
                                    {errors.product_id}
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
                            <th className="px-4 py-3">
                                #
                            </th>
                            <th className="px-4 py-3">
                                Varient Name
                            </th>
                            <th className="px-4 py-3">
                                Product
                            </th>
                            <th className="px-4 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {varients?.data?.length > 0 ? (
                            varients.data.map(
                                (
                                    varient,
                                    index
                                ) => (
                                    <tr
                                        key={
                                            varient.id
                                        }
                                        className="border-b"
                                    >
                                        <td className="px-4 py-3 text-center text-black">
                                            {index + 1}
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {
                                                varient.name
                                            }
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {varient
                                                .product
                                                ?.name ||
                                                '-'}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleEdit(
                                                            varient
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
                                                            varient.id
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
                                    colSpan="4"
                                    className="py-8 text-center text-gray-500 font-medium"
                                >
                                    No Varients Found
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
                            Delete Varient
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
                                setDeleteOpen(
                                    false
                                )
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={
                                handleDelete
                            }
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
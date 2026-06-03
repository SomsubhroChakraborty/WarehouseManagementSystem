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

export default function Brand({ brands = [], search = '' }) {
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
        search: search,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.id) {
            put(`/brand/${data.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    reset('id', 'name');
                    setOpen(false);
                },
            });
        } else {
            post('/brand', {
                preserveScroll: true,
                onSuccess: () => {
                    reset('id', 'name');
                    setOpen(false);
                },
            });
        }
    };

    const handleEdit = (brand) => {
        setData('id', brand.id);
        setData('name', brand.name);
        setOpen(true);
    };

    const handleDelete = () => {
        destroy(`/brand/${data.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                reset('id');
            },
        });
    };

    const handleSearch = () => {
        get(
            '/brand',
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
            '/brand',
            {},
            {
                preserveScroll: true,
                replace: true,
            }
        );
    };

    return (
        <div className="space-y-6 p-6">
            <div className="font-bold text-white">
                Brand Management
            </div>

            <div className="flex items-end justify-between">
                <div className="flex items-end gap-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Search
                        </label>

                        <Input
                            placeholder="Search brand..."
                            value={data.search}
                            onChange={(e) =>
                                setData('search', e.target.value)
                            }
                        />
                    </div>

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
                                reset('id', 'name')
                            }
                        >
                            Add Brand
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {data.id
                                    ? 'Edit Brand'
                                    : 'Create Brand'}
                            </DialogTitle>

                            <DialogDescription>
                                Enter brand information below.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <Input
                                placeholder="Brand Name"
                                value={data.name}
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
                                    {processing
                                        ? 'Saving...'
                                        : 'Save'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#0F172B]">
                            <th className="w-20 border-b px-4 py-3 text-left font-semibold">
                                #
                            </th>

                            <th className="border-b px-4 py-3 text-center font-semibold">
                                Name
                            </th>

                            <th className="w-40 border-b px-4 py-3 text-center font-semibold">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {brands.length > 0 ? (
                            brands.map((brand, index) => (
                                <tr
                                    key={brand.id}
                                    className="border-b hover:bg-slate-50"
                                >
                                    <td className="px-4 py-3 text-black">
                                        {index + 1}
                                    </td>

                                    <td className="px-4 py-3 text-center text-black">
                                        {brand.name}
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleEdit(
                                                        brand
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
                                                        brand.id
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
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="py-6 text-center"
                                >
                                    No brands found.
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
                            Delete Brand
                        </DialogTitle>

                        <DialogDescription>
                            This action cannot be undone.
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
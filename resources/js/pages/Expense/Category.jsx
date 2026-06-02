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

export default function Category({ categories = [], search = '' }) {
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
            put(`/expense/category/${data.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    reset('id', 'name');
                    setOpen(false);
                },
            });
        } else {
            post('/expense/category', {
                preserveScroll: true,
                onSuccess: () => {
                    reset('id', 'name');
                    setOpen(false);
                },
            });
        }
    };

    const handleEdit = (category) => {
        setData('id', category.id);
        setData('name', category.name);
        setOpen(true);
    };

    const handleDelete = () => {
        destroy(`/expense/category/${data.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                reset('id');
            },
        });
    };

    const handleSearch = () => {
        get(
            '/expense/category',
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
            '/expense/category',
            {},
            {
                preserveScroll: true,
                replace: true,
            }
        );
    };

    return (
        <div className="space-y-6 p-6">
                    <div className='text-white font-bold'>Expense Category</div>
            <div className="flex items-end justify-between">
                <div className="flex items-end gap-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Search
                        </label>

                        <Input
                            placeholder="Search category..."
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
                            onClick={() => {
                                reset('id', 'name');
                            }}
                        >
                            Add Category
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {data.id
                                    ? 'Edit Category'
                                    : 'Create Category'}
                            </DialogTitle>

                            <DialogDescription>
                                Enter category information below.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <Input
                                placeholder="Category Name"
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
    <table className="w-full ">
        <thead>
            <tr className="bg-[#0F172B]">
                <th className="w-20 border-b px-4 py-3 text-left font-semibold ">
                    #
                </th>

                <th className="border-b px-4 py-3 text-center font-semibold ">
                    Name
                </th>

                <th className="w-40 border-b px-4 py-3 text-center font-semibold">
                    Action
                </th>
            </tr>
        </thead>

        <tbody>
            {categories.length > 0 ? (
                categories.map((category, index) => (
                    <tr
                        key={category.id}
                        className="border-b hover:bg-slate-50"
                    >
                        <td className="px-4 py-3  text-black">
                            {index + 1}
                        </td>

                        <td className="px-4 py-3 flex justify-center text-black">
                            {category.name}
                        </td>

                        <td className="px-4 py-3">
                            <div className="flex justify-center gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        handleEdit(category)
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
                                            category.id
                                        );
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
                        colSpan={3}
                        className="py-6 text-center"
                    >
                        No categories found.
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
                            Delete Category
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
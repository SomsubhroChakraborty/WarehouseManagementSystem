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

export default function Bank({
    banks = [],
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
        branch: '',
        account_number: '',
        search,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.id) {
            put(`/bank/${data.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    reset(
                        'id',
                        'name',
                        'branch',
                        'account_number'
                    );
                    setOpen(false);
                },
            });
        } else {
            post('/bank', {
                preserveScroll: true,
                onSuccess: () => {
                    reset(
                        'id',
                        'name',
                        'branch',
                        'account_number'
                    );
                    setOpen(false);
                },
            });
        }
    };

    const handleEdit = (bank) => {
        setData({
            ...data,
            id: bank.id,
            name: bank.name,
            branch: bank.branch,
            account_number: bank.account_number,
        });

        setOpen(true);
    };

    const handleDelete = () => {
        destroy(`/bank/${data.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                reset('id');
            },
        });
    };

    const handleSearch = () => {
        get(
            '/bank',
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
            '/bank',
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
                Bank List
            </div>

            <div className="flex items-end justify-between">
                <div className="flex items-end gap-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Search
                        </label>

                        <Input
                            placeholder="Search bank..."
                            value={data.search}
                            onChange={(e) =>
                                setData(
                                    'search',
                                    e.target.value
                                )
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

                <Dialog
                    open={open}
                    onOpenChange={setOpen}
                >
                    <DialogTrigger asChild>
                        <Button
                            onClick={() =>
                                reset(
                                    'id',
                                    'name',
                                    'branch',
                                    'account_number'
                                )
                            }
                        >
                            Add Bank
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {data.id
                                    ? 'Edit Bank'
                                    : 'Create Bank'}
                            </DialogTitle>

                            <DialogDescription>
                                Enter bank details below.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div>
                                <Input
                                    placeholder="Bank Name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData(
                                            'name',
                                            e.target.value
                                        )
                                    }
                                />

                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Input
                                    placeholder="Branch"
                                    value={data.branch}
                                    onChange={(e) =>
                                        setData(
                                            'branch',
                                            e.target.value
                                        )
                                    }
                                />

                                {errors.branch && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.branch}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Input
                                    type="number"
                                    placeholder="Account Number"
                                    value={
                                        data.account_number
                                    }
                                    onChange={(e) =>
                                        setData(
                                            'account_number',
                                            e.target.value
                                        )
                                    }
                                />

                                {errors.account_number && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {
                                            errors.account_number
                                        }
                                    </p>
                                )}
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setOpen(
                                            false
                                        )
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
                        <tr className="bg-[#0F172B] text-white">
                            <th className="w-20 px-4 py-3 text-left">
                                #
                            </th>

                            <th className="px-4 py-3 text-center">
                                Bank Name
                            </th>

                            <th className="px-4 py-3 text-center">
                                Branch
                            </th>

                            <th className="px-4 py-3 text-center">
                                Account Number
                            </th>

                            <th className="w-40 px-4 py-3 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {banks.length > 0 ? (
                            banks.map(
                                (
                                    bank,
                                    index
                                ) => (
                                    <tr
                                        key={
                                            bank.id
                                        }
                                        className="border-b hover:bg-slate-50"
                                    >
                                        <td className="px-4 py-3 text-black">
                                            {index +
                                                1}
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {
                                                bank.name
                                            }
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {
                                                bank.branch
                                            }
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {
                                                bank.account_number
                                            }
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleEdit(
                                                            bank
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
                                                            bank.id
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
                                    colSpan={
                                        5
                                    }
                                    className="py-6 text-center text-black"
                                >
                                    No banks found.
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
                            Delete Bank
                        </DialogTitle>

                        <DialogDescription>
                            This action cannot
                            be undone.
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
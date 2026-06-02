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

export default function List({
    expenses = { data: [] },
    categories = [],
    users = [],
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
        user_id: '',
        expense_category_id: '',
        amount: '',
        note: '',
        search: search,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.id) {
            put(`/expense/list/${data.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    reset(
                        'id',
                        'user_id',
                        'expense_category_id',
                        'amount',
                        'note'
                    );
                    setOpen(false);
                },
            });
        } else {
            post('/expense/list', {
                preserveScroll: true,
                onSuccess: () => {
                    reset(
                        'id',
                        'user_id',
                        'expense_category_id',
                        'amount',
                        'note'
                    );
                    setOpen(false);
                },
            });
        }
    };

    const handleEdit = (expense) => {
        setData({
            ...data,
            id: expense.id,
            user_id: expense.user_id,
            expense_category_id:
                expense.expense_category_id,
            amount: expense.amount,
            note: expense.note || '',
        });

        setOpen(true);
    };

    const handleDelete = () => {
        destroy(`/expense/list/${data.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                reset('id');
            },
        });
    };

    const handleSearch = () => {
        get(
            '/expense/list',
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
            '/expense/list',
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
                Expense List
            </div>

            <div className="flex items-end justify-between">
                <div className="flex items-end gap-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Search
                        </label>

                        <Input
                            placeholder="Search by user..."
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
                                    'user_id',
                                    'expense_category_id',
                                    'amount',
                                    'note'
                                )
                            }
                        >
                            Add Expense
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {data.id
                                    ? 'Edit Expense'
                                    : 'Create Expense'}
                            </DialogTitle>

                            <DialogDescription>
                                Enter expense details below.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div>
                                <select
                                    className="w-full rounded-md border p-2"
                                    value={data.user_id}
                                    onChange={(e) =>
                                        setData(
                                            'user_id',
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="" className='text-black'>
                                        Select User
                                    </option>

                                    {users.map(
                                        (user) => (
                                            <option
                                                key={
                                                    user.id
                                                }
                                                value={
                                                    user.id
                                                }
                                                 style={{ color: 'black' }}
                                            >
                                                {
                                                    user.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                                {errors.user_id && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {
                                            errors.user_id
                                        }
                                    </p>
                                )}
                            </div>

                            <div>
                                <select
                                    className="w-full rounded-md border p-2"
                                    value={
                                        data.expense_category_id
                                    }
                                    onChange={(e) =>
                                        setData(
                                            'expense_category_id',
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Select Category
                                    </option>

                                    {categories.map(
                                        (
                                            category
                                        ) => (
                                            <option
                                                key={
                                                    category.id
                                                }
                                                value={
                                                    category.id
                                                }
                                                style={{ color: 'black' }}
                                            >
                                                {
                                                    category.name
                                                }
                                                
                                            </option>
                                        )
                                    )}
                                </select>

                                {errors.expense_category_id && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {
                                            errors.expense_category_id
                                        }
                                    </p>
                                )}
                            </div>

                            <div>
                                <Input
                                    type="number"
                                    placeholder="Amount"
                                    value={
                                        data.amount
                                    }
                                    onChange={(e) =>
                                        setData(
                                            'amount',
                                            e.target.value
                                        )
                                    }
                                />

                                {errors.amount && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {
                                            errors.amount
                                        }
                                    </p>
                                )}
                            </div>

                            <div>
                                <Input
                                    placeholder="Note"
                                    value={data.note}
                                    onChange={(e) =>
                                        setData(
                                            'note',
                                            e.target.value
                                        )
                                    }
                                />

                                {errors.note && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {
                                            errors.note
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
                            <th className="w-20 border-b px-4 py-3 text-left font-semibold">
                                #
                            </th>

                            <th className="border-b px-4 py-3 text-center font-semibold">
                                User
                            </th>

                            <th className="border-b px-4 py-3 text-center font-semibold">
                                Category
                            </th>

                            <th className="border-b px-4 py-3 text-center font-semibold">
                                Amount
                            </th>

                            <th className="border-b px-4 py-3 text-center font-semibold">
                                Note
                            </th>

                            <th className="w-40 border-b px-4 py-3 text-center font-semibold">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {expenses.data.length >
                        0 ? (
                            expenses.data.map(
                                (
                                    expense,
                                    index
                                ) => (
                                    <tr
                                        key={
                                            expense.id
                                        }
                                        className="border-b hover:bg-slate-50"
                                    >
                                        <td className="px-4 py-3 text-black">
                                            {index +
                                                1}
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {
                                                expense
                                                    .user
                                                    ?.name
                                            }
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {
                                                expense
                                                    .expense_category
                                                    ?.name
                                            }
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            ₹
                                            {
                                                expense.amount
                                            }
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {
                                                expense.note
                                            }
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleEdit(
                                                            expense
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
                                                            expense.id
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
                                        6
                                    }
                                    className="py-6 text-center text-black"
                                >
                                    No expenses
                                    found.
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
                            Delete Expense
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
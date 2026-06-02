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

export default function Ledger({
    ledgers = [],
    banks = [],
    totalCredit = 0,
    totalDebit = 0,
    balance = 0,
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
        bank_id: '',
        bank_name: '',
        branch: '',
        account_number: '',
        type: '',
        amount: '',
        transaction_date: '',
        note: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.id) {
            put(`/ledger/${data.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
            });
        } else {
            post('/ledger', {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
            });
        }
    };

    const handleEdit = (ledger) => {
        setData({
            id: ledger.id,
            bank_id: ledger.bank_id,
            bank_name: ledger.bank?.name ?? '',
            branch: ledger.bank?.branch ?? '',
            account_number: ledger.bank?.account_number ?? '',
            type: ledger.type,
            amount: ledger.amount,
            transaction_date: ledger.transaction_date,
            note: ledger.note ?? '',
        });

        setOpen(true);
    };

    const handleDelete = () => {
        destroy(`/ledger/${data.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                reset();
            },
        });
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">
                    Ledger List
                </h1>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() =>
                                reset()
                            }
                        >
                            Add Ledger
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {data.id
                                    ? 'Edit Ledger'
                                    : 'Create Ledger'}
                            </DialogTitle>

                            <DialogDescription>
                                Enter ledger information.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            {/* Modified Bank Dropdown Section */}
                            <div>
                                <select
                                    className="w-full rounded-md border p-2"
                                    value={data.bank_id}
                                    onChange={(e) => {
                                        const bank = banks.find(
                                            (b) => b.id == e.target.value
                                        );

                                        setData({
                                            ...data,
                                            bank_id: bank?.id || '',
                                            bank_name: bank?.name || '',
                                            branch: bank?.branch || '',
                                            account_number:
                                                bank?.account_number || '',
                                        });
                                    }}
                                >
                                    <option value="">
                                        Select Bank Account
                                    </option>

                                    {banks.map((bank) => (
                                        <option
                                            key={bank.id}
                                            value={bank.id}
                                        >
                                            {bank.name} | {bank.branch} | {bank.account_number}
                                        </option>
                                    ))}
                                </select>

                                {errors.bank_id && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.bank_id}
                                    </p>
                                )}
                            </div>

                            {/* Aligned Read-only Inputs */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <Input
                                    value={data.bank_name}
                                    readOnly
                                    placeholder="Bank Name"
                                />

                                <Input
                                    value={data.branch}
                                    readOnly
                                    placeholder="Branch"
                                />

                                <Input
                                    value={data.account_number}
                                    readOnly
                                    placeholder="Account Number"
                                />
                            </div>

                            <div>
                                <select
                                    className="w-full rounded-md border p-2"
                                    value={data.type}
                                    onChange={(e) =>
                                        setData(
                                            'type',
                                            e.target
                                                .value
                                        )
                                    }
                                >
                                    <option value="">
                                        Select Type
                                    </option>

                                    <option value="credit">
                                        Credit
                                    </option>

                                    <option value="debit">
                                        Debit
                                    </option>
                                </select>

                                {errors.type && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.type}
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
                                            e.target
                                                .value
                                        )
                                    }
                                />

                                {errors.amount && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.amount}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Input
                                    type="date"
                                    value={
                                        data.transaction_date
                                    }
                                    onChange={(e) =>
                                        setData(
                                            'transaction_date',
                                            e.target
                                                .value
                                        )
                                    }
                                />

                                {errors.transaction_date && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.transaction_date}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Input
                                    placeholder="Note"
                                    value={
                                        data.note
                                    }
                                    onChange={(e) =>
                                        setData(
                                            'note',
                                            e.target
                                                .value
                                        )
                                    }
                                />
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

            <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-[#0F172B] p-4 border-white">
                    <h3 className="font-semibold">
                        Total Credit
                    </h3>
                    <p className="text-2xl font-bold ">
                        ₹{totalCredit}
                    </p>
                </div>

                <div className="rounded-lg bg-[#0F172B] p-4">
                    <h3 className="font-semibold ">
                        Total Debit
                    </h3>
                    <p className="text-2xl font-bold">
                        ₹{totalDebit}
                    </p>
                </div>

                <div className="rounded-lg bg-[#0F172B] p-4">
                    <h3 className="font-semibold">
                        Balance
                    </h3>
                    <p className="text-2xl font-bold">
                        ₹{balance}
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#0F172B] text-white">
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Bank Name</th>
                            <th className="px-4 py-3">Branch</th>
                            <th className="px-4 py-3">Account No</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Note</th>
                            <th className="px-4 py-3">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {ledgers.length > 0 ? (
                            ledgers.map((ledger, index) => (
                                <tr
                                    key={ledger.id}
                                    className="border-b"
                                >
                                    <td className="px-4 py-3 text-center text-black">
                                        {index + 1}
                                    </td>

                                    <td className="px-4 py-3 text-center text-black">
                                        {ledger.bank?.name}
                                    </td>

                                    <td className="px-4 py-3 text-center text-black">
                                        {ledger.bank?.branch}
                                    </td>

                                    <td className="px-4 py-3 text-center text-black">
                                        {ledger.bank?.account_number}
                                    </td>

                                    <td className="px-4 py-3 text-center text-black">
                                        {ledger.type}
                                    </td>

                                    <td className="px-4 py-3 text-center text-black">
                                        {ledger.amount}
                                    </td>

                                    <td className="px-4 py-3 text-center text-black">
                                        {ledger.transaction_date}
                                    </td>

                                    <td className="px-4 py-3 text-center text-black">
                                        {ledger.note}
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleEdit(ledger)
                                                }
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => {
                                                    setData('id', ledger.id);
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
                                    colSpan={9}
                                    className="py-6 text-center"
                                >
                                    No ledger entries found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Delete Ledger
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
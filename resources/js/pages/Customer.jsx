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

export default function Customer({
    customers,
    filters = {},
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
        phone: '',
        email: '',
        address: '',
        search: filters.search || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.id) {
            put(`/customer/${data.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
            });
        } else {
            post('/customer', {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
            });
        }
    };

    const handleEdit = (customer) => {
        setData({
            id: customer.id,
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            address: customer.address,
            search: data.search,
        });

        setOpen(true);
    };

    const handleDelete = () => {
        destroy(`/customer/${data.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                reset();
            },
        });
    };

    const handleSearch = () => {
        get('/customer', {
            data: {
                search: data.search,
            },
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <div className="space-y-6 p-6">
            <div className="font-bold text-white">
                Customer Management
            </div>

            <div className="flex items-end justify-between">
                <div className="flex items-end gap-2">
                    <Input
                        placeholder="Search customer..."
                        value={data.search}
                        onChange={(e) =>
                            setData('search', e.target.value)
                        }
                    />

                    <Button onClick={handleSearch}>
                        Search
                    </Button>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() =>
                                reset()
                            }
                        >
                            Add Customer
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {data.id
                                    ? 'Edit Customer'
                                    : 'Create Customer'}
                            </DialogTitle>

                            <DialogDescription>
                                Enter customer details.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <Input
                                placeholder="Name"
                                value={data.name}
                                onChange={(e) =>
                                    setData(
                                        'name',
                                        e.target.value
                                    )
                                }
                            />

                            <Input
                                placeholder="Phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData(
                                        'phone',
                                        e.target.value
                                    )
                                }
                            />

                            <Input
                                placeholder="Email"
                                value={data.email}
                                onChange={(e) =>
                                    setData(
                                        'email',
                                        e.target.value
                                    )
                                }
                            />

                            <Input
                                placeholder="Address"
                                value={data.address}
                                onChange={(e) =>
                                    setData(
                                        'address',
                                        e.target.value
                                    )
                                }
                            />

                            <DialogFooter>
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
                        <tr className="bg-[#0F172B]">
                            <th>#</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {customers?.data?.length > 0 ? (
                            customers.data.map(
                                (customer, index) => (
                                    <tr
                                        key={
                                            customer.id
                                        }
                                    >
                                        <td className="px-4 py-3 text-center text-black" >
                                            {index + 1}
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {
                                                customer.name
                                            }
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {
                                                customer.phone
                                            }
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {
                                                customer.email
                                            }
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {
                                                customer.address
                                            }
                                        </td>

                                        <td>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleEdit(
                                                            customer
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
                                                            customer.id
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
                                    colSpan={6}
                                    className="text-center py-4 text-black"
                                >
                                    No customers found.
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
                            Delete Customer
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
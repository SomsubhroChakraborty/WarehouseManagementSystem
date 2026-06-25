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
    suppliers,
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
        company: '',
        email: '',
        address: '',
        search: filters.search || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.id) {
            put(`/suppliers/${data.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
            });
        } else {
            post('/suppliers', {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
            });
        }
    };

    const handleEdit = (suppliers) => {
        setData({
            id: suppliers.id,
            name: suppliers.name,
            phone: suppliers.phone,
            email: suppliers.email,
            address: suppliers.address,
            search: data.search,
        });

        setOpen(true);
    };

    const handleDelete = () => {
        destroy(`/suppliers/${data.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                reset();
            },
        });
    };

    const handleSearch = () => {
        get('/suppliers', {
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
                Supplier Management
            </div>

            <div className="flex items-end justify-between">
                <div className="flex items-end gap-2">
                    <Input
                        placeholder="Search supplier..."
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
                            Add Supplier
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {data.id
                                    ? 'Edit Supplier'
                                    : 'Create Supplier'}
                            </DialogTitle>

                            <DialogDescription>
                                Enter Supplier details.
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
                                placeholder="Company"
                                value={data.company}
                                onChange={(e) =>
                                    setData(
                                        'comapny',
                                        e.target.value || '-'
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
                            <th>Company</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {suppliers?.data?.length > 0 ? (
                            suppliers.data.map(
                                (supplier, index) => (
                                    <tr
                                        key={
                                            supplier.id
                                        }
                                    >
                                        <td className="px-4 py-3 text-center text-black" >
                                            {index + 1}
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {
                                               supplier.name
                                            }
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {
                                               supplier.phone
                                            }
                                        </td>
                                        <td className="px-4 py-3 text-center text-black">
                                            {
                                               supplier.company
                                            }
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {
                                               supplier.email
                                            }
                                        </td>

                                        <td className="px-4 py-3 text-center text-black">
                                            {
                                               supplier.address
                                            }
                                        </td>

                                        <td>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleEdit(
                                                           supplier
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
                                                           supplier.id
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
                                    No suppliers found.
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
                            Delete supplier
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
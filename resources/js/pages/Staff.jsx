import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export default function Staff({ staffs = [], search = '' }) {
    const [open, setOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        id: null,
        name: '',
        address: '',
        phone: '',
        email: '',
        position: '',
        salary: '',
        joining_date: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.id) {
            put(`/staff/${data.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
            });
        } else {
            post('/staff', {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setOpen(false);
                },
            });
        }
    };

    const openCreate = () => {
        reset();
        setOpen(true);
    };

    const handleEdit = (staff) => {
        setData({
            id: staff.id,
            name: staff.name || '',
            address: staff.address || '',
            phone: staff.phone || '',
            email: staff.email || '',
            position: staff.position || '',
            salary: staff.salary || '',
            joining_date: staff.joining_date ? staff.joining_date.substring(0, 10) : '',
        });
        setOpen(true);
    };

    const handleDelete = () => {
        destroy(`/staff/${data.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteOpen(false);
                reset();
            },
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/staff', { search: data.search }, { preserveState: true, replace: true });
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Staff Management</h2>
            </div>

            {/* Search + Add Button */}
            <div className="flex items-end justify-between">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div>
                        <Label>Search Staff</Label>
                        <Input
                            placeholder="Search by name, phone or email..."
                            value={data.search || ''}
                            onChange={(e) => setData('search', e.target.value)}
                            className="w-80"
                        />
                    </div>
                    <Button type="submit">Search</Button>
                    {search && (
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => router.get('/staff')}
                        >
                            Clear
                        </Button>
                    )}
                </form>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreate}>Add New Staff</Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {data.id ? 'Edit Staff' : 'Add New Staff'}
                            </DialogTitle>
                            <DialogDescription>
                                Enter staff information below.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input
                                        placeholder="Enter full name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Position</Label>
                                    <Input
                                        placeholder="e.g. Manager, Cashier"
                                        value={data.position}
                                        onChange={(e) => setData('position', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input
                                        placeholder="Phone number"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        placeholder="Email address"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Salary</Label>
                                    <Input
                                        type="number"
                                        placeholder="Salary"
                                        value={data.salary}
                                        onChange={(e) => setData('salary', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Joining Date</Label>
                                    <Input
                                        type="date"
                                        value={data.joining_date}
                                        onChange={(e) => setData('joining_date', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Input
                                    placeholder="Full address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : data.id ? 'Update Staff' : 'Create Staff'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-[#0F172B] text-white">
                            <th className="px-4 py-4 text-left w-12">#</th>
                            <th className="px-4 py-4 text-left">Name</th>
                            <th className="px-4 py-4 text-left">Position</th>
                            <th className="px-4 py-4 text-left">Phone</th>
                            <th className="px-4 py-4 text-left">Email</th>
                            <th className="px-4 py-4 text-left">Salary</th>
                            <th className="px-4 py-4 text-left">Joining Date</th>
                            <th className="px-4 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffs.length > 0 ? (
                            staffs.map((staff, index) => (
                                <tr key={staff.id} className="border-b hover:bg-slate-50 text-black">
                                    <td className="px-4 py-4 text-black">{index + 1}</td>
                                    <td className="px-4 py-4 font-medium text-black">{staff.name}</td>
                                    <td className="px-4 py-4 text-black">{staff.position}</td>
                                    <td className="px-4 py-4 text-black">{staff.phone}</td>
                                    <td className="px-4 py-4 text-black">{staff.email}</td>
                                    <td className="px-4 py-4 text-black">₹{staff.salary}</td>
                                    <td className="px-4 py-4 text-black">{staff.joining_date}</td>
                                    <td className="px-4 py-4 ">
                                        <div className="flex justify-center gap-2">
                                            <Button
                                            className="text-white"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(staff)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => {
                                                    setData('id', staff.id);
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
                                <td colSpan={8} className="py-12 text-center text-slate-500">
                                    No staff found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Staff</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This staff record will be permanently deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Yes, Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaffController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;

        $staffs = Staff::query()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('position', 'like', "%{$search}%");
            })
            ->latest()->get();

        return Inertia::render('Staff', [
            'staffs' => $staffs,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Store a newly created resource.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'address' => 'nullable',
            'phone' => 'required',
            'email' => 'nullable',
            'position' => 'required',
            'salary' => 'required',
            'joining_date' => 'required',
        ]);

        Staff::create($validated);

        return redirect()->back()->with('success', 'Staff created successfully.');
    }

    /**
     * Update the specified resource.
     */
    public function update(Request $request, Staff $staff)
    {
        $validated = $request->validate([
            'name' => 'required',
            'address' => 'nullable',
            'phone' => 'required',
            'email' => 'nullable',
            'position' => 'required',
            'salary' => 'required',
            'joining_date' => 'required',
        ]);

        $staff->update($validated);

        return redirect()->back()->with('success', 'Staff updated successfully.');
    }

    /**
     * Remove the specified resource.
     */
    public function destroy(Staff $staff)
    {
        $staff->delete();

        return redirect()->back()->with('success', 'Staff deleted successfully.');
    }
}
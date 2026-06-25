<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;
          $suppliers = Supplier::query()
        ->when($search, function ($query) use ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
        })
        ->latest()
        ->paginate(10)
    ->withQueryString();

    return Inertia::render('Suppliers', [
        'suppliers' => $suppliers,
        'filters' => [
            'search' => $search,
        ],
    ]);
}
    
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'phone' => 'required',
            'company' => 'nullable',
            'address' => 'required',
            'email' => 'required',
            'notes' => 'nullable',
        ]);

        Supplier::create($validated);
        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Supplier $supplier)
    {
    
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Supplier $supplier)
    {
         $validated = $request->validate([
            'name' => 'required',
            'phone' => 'required',
            'company' => 'nullable',
            'address' => 'required',
            'email' => 'required',
            'notes' => 'nullable',
        ]);
        $supplier->update($validated);
        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return redirect()->back();

    }
}

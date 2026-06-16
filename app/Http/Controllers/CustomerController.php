<?php

namespace App\Http\Controllers;
use Inertia\Inertia;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index(Request $request)
{
    $search = $request->search;

    $customers = Customer::query()
        ->when($search, function ($query) use ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
        })
        ->latest()
        ->paginate(10)
    ->withQueryString();

    return Inertia::render('Customer', [
        'customers' => $customers,
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
     * **/
  public function store(Request $request)
{
    $validated = $request->validate([
        'name'    => 'required',
        'phone'   => 'required',
        'email'   => 'required|email',
        'address' => 'required',
    ]);

    Customer::create($validated);
    return redirect()->back();

}
    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customer $customer)
    {
         $validated = $request->validate([
        'name'    => 'required',
        'phone'   => 'required',
        'email'   => 'required|email',
        'address' => 'required',
    ]);
    $customer->update($validated);
     return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        $customer->delete();
        return redirect()->back();

    }
}

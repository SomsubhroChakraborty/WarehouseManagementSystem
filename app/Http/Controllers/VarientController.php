<?php

namespace App\Http\Controllers;

use App\Models\Varient;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VarientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search; 
        $varients = Varient::with('product')->when($search, function ($query) use ($search) {
            $query->where('name', 'like', "%{$search}%");
        })
        ->latest()
        ->paginate(10);

        return Inertia::render('Varient',[
            'varients' => $varients,
            'products' => Product::all(),
                    'search' => $search,

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
        $request->validate([
            'name'=>'required',
            'product_id'=>'required'
        ]);

        Varient::create([
            'name' => $request->name,
    'product_id' => $request->product_id,
        ]);
                return redirect()->back();

    }

    /**
     * Display the specified resource.
     */
    public function show(Varient $varient)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Varient $varient)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Varient $varient)
    {
     $request->validate([
            'name'=>'required',
            'product_id'=>'required'
        ]);

        $varient->update([
            'name'=>$request->name,
            'product_id'=>$request->product_id,
        ]);   

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Varient $varient)
    {
    $varient->delete();
            return redirect()->back();

    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\Varient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;

        $stocks = Stock::with('varient.product')
            ->when($search, function ($query) use ($search) {
                $query->whereHas('varient', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->get();

        $varients = Varient::with('product')->get();

        return Inertia::render('Stock', [
            'stocks' => $stocks,
            'varients' => $varients,
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
        $request->validate([
            'varient_id' => 'required',
            'quantity' => 'required',
            'stock_received_at'=>'required'
        ]);

        Stock::create([
            'varient_id' => $request->varient_id,
            'quantity' => $request->quantity,
            'stock_received_at'=>$request->stock_received_at
        ]);

        return redirect()->back()->with('success', 'Stock created successfully.');
    }

    /**
     * Update the specified resource.
     */
    public function update(Request $request, Stock $stock)
    {
        $request->validate([
            'varient_id' => 'required',
            'quantity' => 'required',
            'stock_received_at'=>'required'

        ]);

        $stock->update([
            'varient_id' => $request->varient_id,
            'quantity' => $request->quantity,
            'stock_received_at'=>$request->stock_received_at

        ]);

        return redirect()->back()->with('success', 'Stock updated successfully.');
    }

    /**
     * Remove the specified resource.
     */
    public function destroy(Stock $stock)
    {
        $stock->delete();

        return redirect()->back()->with('success', 'Stock deleted successfully.');
    }
}
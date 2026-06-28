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
            'varient_id' => 'required|exists:varients,id',
            'quantity' => 'required|integer|min:1',
            'operation' => 'required|in:add,remove',
            'stock_received_at' => 'required',
        ]);

        $variant = Varient::findOrFail($request->varient_id);

        // Prevent negative stock
        if (
            $request->operation == 'remove' &&
            $variant->varient_qty < $request->quantity
        ) {
            return back()->withErrors([
                'quantity' => 'Not enough stock available.'
            ]);
        }

        // Save stock history
        Stock::create([
            'varient_id' => $request->varient_id,
            'quantity' => $request->quantity,
            'operation' => $request->operation,
            'stock_received_at' => $request->stock_received_at,
        ]);

        // Update current stock
        if ($request->operation == 'add') {
            $variant->increment('varient_qty', $request->quantity);
        } else {
            $variant->decrement('varient_qty', $request->quantity);
        }

        return redirect()->back()->with('success', 'Stock updated successfully.');
    }
}
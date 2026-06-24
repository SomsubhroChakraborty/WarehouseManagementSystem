<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Quotation;
use App\Models\Quotation_item;
use App\Models\Varient;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class QuotationController extends Controller
{
    public function index()
{
    return Inertia::render('Quotations', [
        'customers' => Customer::all(),

        'products' => Product::with('varients')->get(),

        'quotations' => Quotation::with([
            'customer',
            'items.varient'
        ])->latest()->get(),
    ]);
}

    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required',
            'valid' => 'required',
            'customer_id' => 'required',
            'payment' => 'required',
            'items' => 'required|array|min:1',
        ]);

        DB::transaction(function () use ($request) {

            $quotation = Quotation::create([
                'date' => $request->date,
                'valid' => $request->valid,
                'customer_id' => $request->customer_id,
                'payment' => $request->payment,
                'note' => $request->note,
            ]);

            foreach ($request->items as $item) {

                Quotation_item::create([
                    'quotation_id' => $quotation->id,
                    'varient_id' => $item['varient_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }
        });

        return redirect()->back();
    }

   public function update(Request $request, Quotation $quotation)
{
    $request->validate([
        'date' => 'required',
        'valid' => 'required',
        'customer_id' => 'required',
        'payment' => 'required',
        'items' => 'required|array|min:1',
    ]);

    DB::transaction(function () use ($request, $quotation) {

        $quotation->update([
            'date' => $request->date,
            'valid' => $request->valid,
            'customer_id' => $request->customer_id,
            'payment' => $request->payment,
            'note' => $request->note,
        ]);

        // Delete old items
        $quotation->items()->delete();

        // Insert new items
        foreach ($request->items as $item) {
            Quotation_item::create([
                'quotation_id' => $quotation->id,
                'varient_id' => $item['varient_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        }
    });

    return redirect()->back();
}
    public function destroy(Quotation $quotation)
    {
        $quotation->delete();

        return back();
    }
}
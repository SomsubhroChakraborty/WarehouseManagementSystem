<?php

namespace App\Http\Controllers;

use App\Models\PosSale;
use App\Models\PosSaleItem;
use App\Models\Stock;
use App\Models\Varient;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PosSaleController extends Controller
{
    /**
     * Display the POS page.
     */
   public function index()
{
    $categories = ProductCategory::with([
        'products.varients' => function ($query) {
            $query->where('varient_qty', '>', 0);
        }
    ])->get();

    return Inertia::render('POS', [
        'categories' => $categories,
    ]);
}

    /**
     * Complete a POS sale.
     */
    public function store(Request $request)
    {
        //  dd($request->all()); 
        $request->validate([
            'invoice_no'      => 'required|unique:pos_sales,invoice_no',
            'subtotal'        => 'required|numeric',
            'discount'        => 'nullable|numeric',
            'tax'             => 'nullable|numeric',
            'grand_total'     => 'required|numeric',
            'payment_method'  => 'required',
            'paid_amount'     => 'required|numeric',
            'change_amount'   => 'required|numeric',
            'items'           => 'required|array|min:1',
        ]);

        DB::transaction(function () use ($request) {

            // Create POS Sale
            $sale = PosSale::create([
                'invoice_no'     => $request->invoice_no,
                'subtotal'       => $request->subtotal,
                'discount'       => $request->discount ?? 0,
                'tax'            => $request->tax ?? 0,
                'grand_total'    => $request->grand_total,
                'payment_method' => $request->payment_method,
                'paid_amount'    => $request->paid_amount,
                'change_amount'  => $request->change_amount,
            ]);

            foreach ($request->items as $item) {

                $variant = Varient::findOrFail($item['varient_id']);

                // Check stock
                if ($variant->varient_qty < $item['quantity']) {
                    throw new \Exception(
                        "{$variant->name} has only {$variant->varient_qty} items left."
                    );
                }

                // Save sale item
                PosSaleItem::create([
                    'pos_sale_id' => $sale->id,
                    'product_id'  => $item['product_id'],
                    'varient_id'  => $item['varient_id'],
                    'quantity'    => $item['quantity'],
                    'price'       => $item['price'],
                    'total'       => $item['total'],
                ]);

                // Reduce stock
                $variant->decrement('varient_qty', $item['quantity']);

                // Create stock history
                Stock::create([
                    'varient_id'        => $item['varient_id'],
                    'quantity'          => $item['quantity'],
                    'operation'         => 'remove',
                    'stock_received_at' => now(),
                ]);
            }
        });

        return redirect()->back()->with('success', 'Sale completed successfully.');
    }
}
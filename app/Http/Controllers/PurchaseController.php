<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Supplier;
use App\Models\varient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;

        $purchases = Purchase::with(['supplier','items.varient'])
            ->when($search, function ($query) use ($search) {
                $query->where('supplier_invoice_no', 'like', "%{$search}%")
                    ->orWhereHas('supplier', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Purchases', [
            'purchases' => $purchases,
            'suppliers' => Supplier::orderBy('name')->get(),
            'products' => Product::orderBy('name')->get(),
            'varients' => Varient::orderBy('name')->get(),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Generate the next purchase_no, e.g. PUR-20260626-0001.
     * Must be called inside a DB::transaction with the table locked
     * to avoid duplicate numbers under concurrent requests.
     */
    private function generatePurchaseNo(): string
    {
        $prefix = 'PUR-' . now()->format('Ymd') . '-';

        $lastNumber = Purchase::where('purchase_no', 'like', $prefix . '%')
            ->lockForUpdate()
            ->orderByDesc('purchase_no')
            ->value('purchase_no');

        $nextSequence = $lastNumber
            ? ((int) substr($lastNumber, -4)) + 1
            : 1;

        return $prefix . str_pad($nextSequence, 4, '0', STR_PAD_LEFT);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'supplier_invoice_no' => ['required', 'unique:purchases,supplier_invoice_no'],
            'purchase_date' => ['required', 'date'],
            'subtotal' => ['required', 'numeric'],
            'discount' => ['nullable', 'numeric'],
            'tax' => ['nullable', 'numeric'],
            'shipping_charge' => ['nullable', 'numeric'],
            'grand_total' => ['required', 'numeric'],
            'status' => ['required', 'in:Pending,Received,Cancelled'],
            'remarks' => ['nullable', 'string'],

            'items' => ['required', 'array', 'min:1'],

            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.varient_id' => ['required', 'exists:varients,id'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.01'],
            'items.*.purchase_price' => ['required', 'numeric'],
            'items.*.discount' => ['nullable', 'numeric'],
            'items.*.tax' => ['nullable', 'numeric'],
            'items.*.total' => ['required', 'numeric'],
        ]);

        DB::transaction(function () use ($validated) {

            $purchase = Purchase::create([
                'purchase_no' => $this->generatePurchaseNo(),
                'supplier_id' => $validated['supplier_id'],
                'supplier_invoice_no' => $validated['supplier_invoice_no'],
                'purchase_date' => $validated['purchase_date'],
                'subtotal' => $validated['subtotal'],
                'discount' => $validated['discount'] ?? 0,
                'tax' => $validated['tax'] ?? 0,
                'shipping_charge' => $validated['shipping_charge'] ?? 0,
                'grand_total' => $validated['grand_total'],
                'status' => $validated['status'],
                'remarks' => $validated['remarks'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {

                $varient = varient::findOrFail($item['varient_id']);

                if ($varient->product_id != $item['product_id']) {
                    abort(422, 'Selected varient does not belong to the selected product.');
                }

                $purchase->items()->create([
                    'product_id' => $item['product_id'],
                    'varient_id' => $item['varient_id'],
                    'quantity' => $item['quantity'],
                    'purchase_price' => $item['purchase_price'],
                    'discount' => $item['discount'] ?? 0,
                    'tax' => $item['tax'] ?? 0,
                    'total' => $item['total'],
                ]);

                
            }
        });

        return back()->with('success', 'Purchase created successfully.');
    }

    public function update(Request $request, Purchase $purchase)
    {
        $purchase->load('items.varient');

        $validated = $request->validate([
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'supplier_invoice_no' => ['required', 'unique:purchases,supplier_invoice_no,' . $purchase->id],
            'purchase_date' => ['required', 'date'],
            'subtotal' => ['required', 'numeric'],
            'discount' => ['nullable', 'numeric'],
            'tax' => ['nullable', 'numeric'],
            'shipping_charge' => ['nullable', 'numeric'],
            'grand_total' => ['required', 'numeric'],
            'status' => ['required', 'in:Pending,Received,Cancelled'],
            'remarks' => ['nullable', 'string'],

            'items' => ['required', 'array', 'min:1'],

            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.varient_id' => ['required', 'exists:varients,id'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.01'],
            'items.*.purchase_price' => ['required', 'numeric'],
            'items.*.discount' => ['nullable', 'numeric'],
            'items.*.tax' => ['nullable', 'numeric'],
            'items.*.total' => ['required', 'numeric'],
        ]);

        DB::transaction(function () use ($purchase, $validated) {

            // Reverse previous stock
          

            // Delete old items
            $purchase->items()->delete();

            // Update purchase — purchase_no is intentionally NOT regenerated on edit
            $purchase->update([
                'supplier_id' => $validated['supplier_id'],
                'supplier_invoice_no' => $validated['supplier_invoice_no'],
                'purchase_date' => $validated['purchase_date'],
                'subtotal' => $validated['subtotal'],
                'discount' => $validated['discount'] ?? 0,
                'tax' => $validated['tax'] ?? 0,
                'shipping_charge' => $validated['shipping_charge'] ?? 0,
                'grand_total' => $validated['grand_total'],
                'status' => $validated['status'],
                'remarks' => $validated['remarks'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {

                $varient = varient::findOrFail($item['varient_id']);

                if ($varient->product_id != $item['product_id']) {
                    abort(422, 'Selected varient does not belong to the selected product.');
                }

                $purchase->items()->create([
                    'product_id' => $item['product_id'],
                    'varient_id' => $item['varient_id'],
                    'quantity' => $item['quantity'],
                    'purchase_price' => $item['purchase_price'],
                    'discount' => $item['discount'] ?? 0,
                    'tax' => $item['tax'] ?? 0,
                    'total' => $item['total'],
                ]);

               
            }
        });

        return back()->with('success', 'Purchase updated successfully.');
    }

    public function destroy(Purchase $purchase)
    {
        $purchase->load('items.varient');

        DB::transaction(function () use ($purchase) {

            if ($purchase->status === 'Received') {
                foreach ($purchase->items as $item) {
                    $item->varient->decrement('stock', $item->quantity);
                }
            }

            $purchase->items()->delete();

            $purchase->delete();
        });

        return back()->with('success', 'Purchase deleted successfully.');
    }
}
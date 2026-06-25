<?php

namespace App\Http\Controllers;

use App\Models\Quotation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Quotation::with([
            'customer',
            'items.varient'
        ]);

        if ($request->search) {

            $query->whereHas('customer', function ($q) use ($request) {

                $q->where(
                    'name',
                    'like',
                    '%' . $request->search . '%'
                );
            });
        }

        if ($request->status) {

            $query->where(
                'payment_status',
                $request->status
            );
        }

        $invoices = $query
            ->latest()
            ->get();

        return Inertia::render('Invoices', [
            'invoices' => $invoices,
            'filters' => $request->only([
                'search',
                'status'
            ])
        ]);
    }

    public function preview(Quotation $quotation)
    {
        $quotation->load([
            'customer',
            'items.varient.product'
        ]);

        $pdf = Pdf::loadView(
            'invoice',
            compact('quotation')
        );

        return $pdf->stream();
    }

    public function download(Quotation $quotation)
    {
        $quotation->load([
            'customer',
            'items.varient.product'
        ]);

        $pdf = Pdf::loadView(
            'invoice',
            compact('quotation')
        );

        return $pdf->download(
            'invoice-'.$quotation->id.'.pdf'
        );
    }

    public function updateStatus(Request $request, Quotation $quotation)
{
    $request->validate([
        'payment_status' => 'required|in:pending,partial,paid',
    ]);

    $quotation->update([
        'payment_status' => $request->payment_status,
    ]);

    return back();
}
}
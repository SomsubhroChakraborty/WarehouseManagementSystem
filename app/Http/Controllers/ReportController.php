<?php

namespace App\Http\Controllers;

use App\Models\PosSale;
use App\Models\Purchase;
use App\Models\Quotation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function posSales()
    {
        $reports = PosSale::latest()->get();

        return Inertia::render('Reports/PosSalesReport', [
            'reports' => $reports
        ]);
    }

   public function customerSales(Request $request)
{
    $query = Quotation::with([
        'customer',
        'items',
    ]);

    // Search by customer name
    if ($request->search) {
        $query->whereHas('customer', function ($q) use ($request) {
            $q->where('name', 'like', '%' . $request->search . '%');
        });
    }

    // Filter
    if ($request->period === 'daily') {
        $query->whereDate('created_at', today());
    }

    if ($request->period === 'monthly') {
        $query->whereMonth('created_at', now()->month)
              ->whereYear('created_at', now()->year);
    }

    if ($request->period === 'yearly') {
        $query->whereYear('created_at', now()->year);
    }

    $reports = $query->latest()->get();

    return Inertia::render('Reports/CustomerSalesReport', [
        'reports' => $reports,
        'search' => $request->search,
        'period' => $request->period,
    ]);
}

   public function purchases(Request $request)
{
    $search = $request->search;
    $period = $request->period;

    $reports = Purchase::with('supplier')
        ->when($search, function ($query) use ($search) {
            $query->whereHas('supplier', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        })
        ->when($period, function ($query) use ($period) {
            if ($period === 'daily') {
                $query->whereDate('purchase_date', now()->toDateString());
            } elseif ($period === 'monthly') {
                $query->whereMonth('purchase_date', now()->month)
                      ->whereYear('purchase_date', now()->year);
            } elseif ($period === 'yearly') {
                $query->whereYear('purchase_date', now()->year);
            }
        })
        ->latest()
        ->get();

    return Inertia::render('Reports/PurchaseReport', [
        'reports' => $reports,
        'search' => $search,
        'period' => $period,
    ]);
}
}
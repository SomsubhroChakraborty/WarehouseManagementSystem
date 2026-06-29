<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Varient;
use App\Models\Customer;
use App\Models\Supplier;
use App\Models\Purchase;
use App\Models\PosSale;
use App\Models\Stock;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        return Inertia::render('dashboard', [

            // Statistics
            'stats' => [
                'todaySale' => PosSale::whereDate('created_at', $today)
                    ->sum('grand_total'),

                'todayPurchase' => Purchase::whereDate('created_at', $today)
                    ->sum('grand_total'),

                'products' => Product::count(),

                'variants' => Varient::count(),

                'customers' => Customer::count(),

                'suppliers' => Supplier::count(),

                'lowStock' => Varient::where('varient_qty', '<=', 5)
                    ->where('varient_qty', '>', 0)
                    ->count(),

                'outOfStock' => Varient::where('varient_qty', 0)->count(),

                'inventoryValue' => Varient::sum(\DB::raw('varient_qty * price')),
            ],

            // Recent POS Sales
            'recentSales' => PosSale::latest()
                ->take(5)
                ->get(),

            // Recent Purchases
            'recentPurchases' => Purchase::with('supplier')
                ->latest()
                ->take(5)
                ->get(),

            // Recent Stock Activities
            'stockActivities' => Stock::with('varient.product')
                ->latest()
                ->take(10)
                ->get(),

            // Low Stock Products
            'lowStockProducts' => Varient::with('product')
                ->where('varient_qty', '<=', 5)
                ->orderBy('varient_qty')
                ->take(10)
                ->get(),
        ]);
    }
}
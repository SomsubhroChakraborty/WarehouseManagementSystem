<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Brand;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;

        $products = Product::with(['brand', 'productCategory'])
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->get();

       return Inertia::render('Product', [
    'products' => Product::with(['brand', 'productCategory'])->paginate(10),
    'brands' => Brand::all(),
    'categories' => ProductCategory::all(),
    'search' => $request->search,
]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'brand_id' => 'required',
            'product_category_id' => 'required',
        ]);

        Product::create([
            'name' => $request->name,
            'brand_id' => $request->brand_id,
            'product_category_id' => $request->product_category_id,
        ]);

        return redirect()->back()->with('success', 'Product created successfully.');
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required',
            'brand_id' => 'required',
            'product_category_id' => 'required',
        ]);

        $product->update([
            'name' => $request->name,
            'brand_id' => $request->brand_id,
            'product_category_id' => $request->product_category_id,
        ]);

        return redirect()->back()->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->back()->with('success', 'Product deleted successfully.');
    }
}
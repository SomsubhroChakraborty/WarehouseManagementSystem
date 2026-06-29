<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use Illuminate\Http\Request;
use App\Models\Brand;
use Inertia\Inertia;

class ProductCategoryController extends Controller
{
    
    public function index(Request $request)
{
    $search = $request->query('search');

    $query = ProductCategory::with('brand');

    if ($search) {
        $query->where('name', 'like', "%{$search}%");
    }

    $productCategories = $query->latest()->paginate(10);

    $brands = Brand::all();

    return Inertia::render('ProductCategory', [
        'productCategories' => $productCategories,
        'brands' => $brands,
        'search' => $search,
    ]);
}

 
    public function store(Request $request)
    {
        $request->validate([
            'name'=>'required',
            'brand_id'=>'required',
        ]);

        ProductCategory::create([
             'name'=>$request->name,
            'brand_id'=>$request->brand_id,
        ]);
        return redirect()->route('productcategory.index');
    }

    public function update(Request $request, ProductCategory $productCategory)
    {
        $request->validate([
            'name'=>'required',
            'brand_id'=>'required',
        ]);

        $productCategory->update([
             'name'=>$request->name,
            'brand_id'=>$request->brand_id,
        ]);

        return redirect()->route('productcategory.index');
    }

   public function destroy(ProductCategory $productCategory)
{
    if ($productCategory->products()->exists()) {
        return redirect()
            ->route('productcategory.index')
            ->with('error', 'This category contains products and cannot be deleted.');
    }

    $productCategory->delete();

    return redirect()
        ->route('productcategory.index')
        ->with('success', 'Category deleted successfully.');
}
}

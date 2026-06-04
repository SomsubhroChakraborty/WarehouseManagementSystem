<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use Illuminate\Http\Request;
use App\Models\Brand;
use Inertia\Inertia;

class ProductCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
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

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
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

    /**
     * Display the specified resource.
     */
    public function show(ProductCategory $productCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductCategory $productCategory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductCategory $productCategory)
    {
    $productCategory->delete();
                return redirect()->route('productcategory.index');

    }
}

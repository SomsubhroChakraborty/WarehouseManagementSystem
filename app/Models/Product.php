<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name','brand_id', 'product_category_id'
    ];

    public function brand(){
        return $this->belongsTo(Brand::class);
    }
    
    public function productCategory(){
        return $this->belongsTo(ProductCategory::class);
    }


}

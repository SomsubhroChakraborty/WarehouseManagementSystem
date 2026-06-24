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
    
    public function product_category(){
        return $this->belongsTo(ProductCategory::class);
    }
    public function varients(){
        return $this->hasMany(Varient::class);
    }


}

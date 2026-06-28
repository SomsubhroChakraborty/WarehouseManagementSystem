<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductCategory extends Model
{
  protected $fillable=[
    'name','brand_id'
  ];

  public function brand(){
    return $this->belongsTo(Brand::class);
  }
  public function products()
{
    return $this->hasMany(Product::class, 'product_category_id');
}
}

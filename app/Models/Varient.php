<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Varient extends Model
{
    protected $fillable = [
        'name', 'product_id', 'sku','price','sale_price','varient_qty','size','color','weight','barcode',
    ];

    public function product(){
        return $this->belongsTo(Product::class);
    }
    public function purchaseItems()
{
    return $this->hasMany(PurchaseItem::class);
}
}

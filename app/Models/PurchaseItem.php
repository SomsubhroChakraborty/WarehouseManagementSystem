<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseItem extends Model
{
    protected $fillable = [
        'purchase_id',
        'product_id',
        'varient_id',
        'quantity',
        'purchase_price',
        'discount',
        'tax',
        'total',
    ];
     public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function varient()
    {
        return $this->belongsTo(Varient::class);
    }
}

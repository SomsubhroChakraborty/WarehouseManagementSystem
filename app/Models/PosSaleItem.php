<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PosSaleItem extends Model
{
     protected $fillable = [
        'pos_sale_id',
        'product_id',
        'varient_id',
        'quantity',
        'price',
        'total',
    ];

    public function sale()
    {
        return $this->belongsTo(PosSale::class, 'pos_sale_id');
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

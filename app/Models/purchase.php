<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable = [
        'supplier_id', 'purchase_no', 'supplier_invoice_no', 'purchase_date',
        'subtotal', 'discount', 'tax', 'shipping_charge', 'grand_total',
        'status', 'remarks',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function items()
    {
        return $this->hasMany(PurchaseItem::class);
    }
}
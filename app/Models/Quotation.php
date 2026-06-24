<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
    protected $fillable = [
        'date',
        'valid',
        'customer_id',
        'payment',
        'note'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function items()
    {
        return $this->hasMany(Quotation_item::class);
    }
}

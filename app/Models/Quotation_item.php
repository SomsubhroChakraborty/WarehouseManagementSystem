<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quotation_item extends Model
{
    protected $fillable = [
        'quotation_id',
        'varient_id',
        'quantity',
        'price'
    ];

    public function quotation()
    {
        return $this->belongsTo(Quotation::class);
    }

    public function varient()
    {
        return $this->belongsTo(Varient::class);
    }
}

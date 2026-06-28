<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $fillable=[
        'varient_id','quantity','operation','stock_received_at'

    ];

    protected $casts = [
        'stock_received_at' => 'datetime',
    ];

    public function varient(){
        return $this->belongsTo(Varient::class);
    }
}

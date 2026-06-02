<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ledger extends Model
{
    protected $fillable=[
        'type','bank_id', 'amount', 'transaction_date','note'
    ];

 public function bank()
    {
        return $this->belongsTo(Bank::class);
    }

}

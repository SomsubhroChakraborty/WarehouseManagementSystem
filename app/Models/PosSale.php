<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PosSale extends Model
{
 protected $fillable = [
    'invoice_no','subtotal','discount','tax','grand_total',"payment_method",'paid_amount'
 ];
   public function items()
    {
        return $this->hasMany(PosSaleItem::class);
    }
}

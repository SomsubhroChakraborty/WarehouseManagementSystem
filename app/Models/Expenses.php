<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expenses extends Model
{
    protected $fillable = [
        'user_id' , 'expense_category_id','amount','note'
    ];
        public function user(){
        return $this->belongsTo(User::class);
    }
    
    public function expense_category(){
        return $this->belongsTo(ExpenseCategory::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{

    protected $fillable = [
        'name','address','phone','email','position','salary','joining_date'
    ];
}

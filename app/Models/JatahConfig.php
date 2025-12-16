<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JatahConfig extends Model
{
    use HasFactory;

    protected $fillable = [
        'jiwa',
        'jatah',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteView extends Model
{
    protected $fillable = ['total'];

    public static function addView(): void
    {
        static::first()?->increment('total');
    }

    public static function getTotal(): int
    {
        return static::first()?->total ?? 0;
    }
}
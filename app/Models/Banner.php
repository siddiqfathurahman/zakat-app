<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Banner extends Model
{
    protected $fillable = [
        'title',
        'image',
        'is_active',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'is_active'  => 'boolean',
        'start_date' => 'date',
        'end_date'   => 'date',
    ];

    // Banner yang sedang aktif dan dalam jadwal tayang
    public function scopeCurrentlyActive($query)
    {
        $today = Carbon::today();
        return $query->where('is_active', true)
            ->where(function ($q) use ($today) {
                $q->whereNull('start_date')->orWhere('start_date', '<=', $today);
            })
            ->where(function ($q) use ($today) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', $today);
            });
    }

    public function getStatusAttribute(): string
    {
        $today = Carbon::today();

        if (!$this->is_active) return 'nonaktif';
        if ($this->start_date && $this->start_date->gt($today)) return 'upcoming';
        if ($this->end_date && $this->end_date->lt($today)) return 'selesai';
        return 'active';
    }
}
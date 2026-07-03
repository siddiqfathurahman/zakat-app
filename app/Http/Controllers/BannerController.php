<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::orderBy('created_at', 'desc')->get()->map(function ($b) {
            return array_merge($b->toArray(), ['status' => $b->status]);
        });

        $occupiedRanges = Banner::where('is_active', true)
            ->whereNotNull('start_date')
            ->whereNotNull('end_date')
            ->get(['id', 'title', 'start_date', 'end_date'])
            ->map(fn($b) => [
                'id'         => $b->id,
                'title'      => $b->title,
                'start_date' => $b->start_date->format('Y-m-d'),
                'end_date'   => $b->end_date->format('Y-m-d'),
            ]);

        return Inertia::render('dashboard/AdminIklan', [
            'banners'        => $banners,
            'occupiedRanges' => $occupiedRanges,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'      => 'required|string|max:255',
            'image'      => 'required|image|mimes:jpeg,png,jpg,webp|max:3048',
            'is_active'  => 'boolean',
            'start_date' => 'nullable|date',
            'end_date'   => 'nullable|date|after_or_equal:start_date',
        ]);

        $file     = $request->file('image');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path     = $file->storeAs('banners', $filename, 'public');

        Banner::create([
            'title'      => $request->title,
            'image'      => $path,
            'is_active'  => $request->boolean('is_active', true),
            'start_date' => $request->start_date,
            'end_date'   => $request->end_date,
        ]);

        return back()->with('success', 'Banner berhasil ditambahkan.');
    }

    public function update(Request $request, Banner $banner)
    {
        $request->validate([
            'title'      => 'required|string|max:255',
            'image'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3048',
            'is_active'  => 'boolean',
            'start_date' => 'nullable|date',
            'end_date'   => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($request->hasFile('image')) {
            if ($banner->image && Storage::disk('public')->exists($banner->image)) {
                Storage::disk('public')->delete($banner->image);
            }
            $file     = $request->file('image');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $banner->image = $file->storeAs('banners', $filename, 'public');
        }

        $banner->update([
            'title'      => $request->title,
            'image'      => $banner->image,
            'is_active'  => $request->boolean('is_active'),
            'start_date' => $request->start_date,
            'end_date'   => $request->end_date,
        ]);

        return back()->with('success', 'Banner berhasil diperbarui.');
    }

    public function toggleActive(Banner $banner)
    {
        $banner->update(['is_active' => !$banner->is_active]);
        return back()->with('success', $banner->is_active ? 'Banner diaktifkan.' : 'Banner dinonaktifkan.');
    }

    public function destroy(Banner $banner)
    {
        if ($banner->image && Storage::disk('public')->exists($banner->image)) {
            Storage::disk('public')->delete($banner->image);
        }
        $banner->delete();
        return back()->with('success', 'Banner berhasil dihapus.');
    }
}
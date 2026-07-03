<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\News;
use Inertia\Inertia;
use App\Models\SiteView;



class HomeController extends Controller
{
    public function index()
    {
        $news = News::where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->take(2)
            ->get();

        SiteView::addView();

        $banner = Banner::currentlyActive()
            ->orderBy('created_at', 'desc')
            ->first();

        return Inertia::render('Home', [
            'news'   => $news,
            'banner' => $banner ? [
                'id'    => $banner->id,
                'title' => $banner->title,
                'image' => '/storage/' . $banner->image,
            ] : null,
        ]);
    }
}
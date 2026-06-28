<?php

namespace App\Http\Controllers;

use App\Models\News;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $news = News::where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->take(2)
            ->get();

        return Inertia::render('Home', [
            'news' => $news,
        ]);
    }
}       
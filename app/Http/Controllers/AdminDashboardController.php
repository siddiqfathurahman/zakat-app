<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\SiteView;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $authUser = Auth::user();
        $totalUsers = User::count();
        $totalNews = News::count();

        $totalSiteViews = SiteView::getTotal();

        return Inertia::render('dashboard/AdminDashboard', [
            'authUser' => [
                'name'     => $authUser->name,
                'username' => $authUser->username,
                'role'     => $authUser->role,
            ],
            'totalUsers'     => $totalUsers,
            'totalNews'      => $totalNews,
            'totalSiteViews' => $totalSiteViews,
        ]);
    }
}
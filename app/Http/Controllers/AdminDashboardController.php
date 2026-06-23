<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $authUser = Auth::user();
        $totalUsers = User::count();

        return Inertia::render('dashboard/AdminDashboard', [
            'authUser' => [
                'name'     => $authUser->name,
                'username' => $authUser->username,
                'role'     => $authUser->role,
            ],
            'totalUsers' => $totalUsers,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show the login form.
     */
    public function showLogin()
    {
        if (Auth::check()) {
            return $this->redirectBasedOnRole(Auth::user());
        }

        return Inertia::render('Login');
    }

    /**
     * Handle authentication.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $loginInput = $credentials['username'];
        $password = $credentials['password'];
        $remember = $request->boolean('remember', false);

        // Determine if logging in using email or username
        $loginField = filter_var($loginInput, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $attemptCredentials = [
            $loginField => $loginInput,
            'password' => $password,
        ];

        if (Auth::attempt($attemptCredentials, $remember)) {
            $request->session()->regenerate();

            $user = Auth::user();
            $user->last_login_at = now();
            $user->save();

            return $this->redirectBasedOnRole($user);
        }

        return back()->withErrors([
            'username' => 'Email atau username tidak cocok dengan data kami.',
        ])->withInput($request->only('username', 'remember'));
    }

    /**
     * Handle logout.
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }

    /**
     * Helper to redirect users to their home routes based on role.
     */
    protected function redirectBasedOnRole($user)
    {
        $role = $user->role;

        switch ($role) {
            case 'super admin':
            case 'admin':
                return redirect()->intended('/admin/dashboard');
            case 'zakat':
                return redirect()->intended('/zakat/input');
            case 'qurban':
                return redirect()->intended('/qurban/input');
            default:
                return redirect('/');
        }
    }
}

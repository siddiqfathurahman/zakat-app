<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PembayarZakatController;
use App\Http\Controllers\PemohonController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('InputZakat');
});

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// Route untuk pembayar zakat
Route::get('/pembayar', [PembayarZakatController::class, 'index'])->name('pembayar.index');
Route::post('/pembayar/store', [PembayarZakatController::class, 'store'])->name('zakat.store');
Route::post('/pembayar/{id}', [PembayarZakatController::class, 'destroy'])->name('zakat.destroy');

// Route untuk pemohon luar
Route::get('/pemohon', [PemohonController::class, 'index'])->name('pemohon.index');
Route::post('/pemohon', [PemohonController::class, 'store'])->name('pemohon.store');
Route::post('/pemohon/{id}/update', [PemohonController::class, 'update'])->name('pemohon.update');
Route::post('/pemohon/{id}/destroy', [PemohonController::class, 'destroy'])->name('pemohon.destroy');
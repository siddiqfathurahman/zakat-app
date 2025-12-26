<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PembayarZakatController;
use App\Http\Controllers\PemohonController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PenerimaZakatController;
use App\Http\Controllers\JatahConfigController;
use App\Http\Controllers\FormulaJatahController;
use App\Http\Controllers\SettingBerasController;
use App\Models\SettingBeras;
use App\Http\Controllers\LaporanBelanjaController;
use App\Http\Controllers\ZakatCompareController;


Route::get('/', function () {
    $setting = SettingBeras::first() ?? SettingBeras::create([
        'harga_per_kg' => 0,
        'harga_2_5kg' => 0,
    ]);
    
    return Inertia::render('InputZakat', [
        'setting' => $setting,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// Route untuk pembayar zakat
Route::get('/pembayar', [PembayarZakatController::class, 'index'])->name('pembayar.index');
Route::post('/pembayar/store', [PembayarZakatController::class, 'store'])->name('zakat.store');
Route::post('/pembayar/{id}/update', [PembayarZakatController::class, 'update'])->name('zakat.update');
Route::post('/pembayar/{id}', [PembayarZakatController::class, 'destroy'])->name('zakat.destroy');

// Route untuk pemohon luar
Route::get('/pemohon', [PemohonController::class, 'index'])->name('pemohon.index');
Route::post('/pemohon', [PemohonController::class, 'store'])->name('pemohon.store');
Route::post('/pemohon/{id}/update', [PemohonController::class, 'update'])->name('pemohon.update');
Route::post('/pemohon/{id}/destroy', [PemohonController::class, 'destroy'])->name('pemohon.destroy');

// Route untuk penerima zakat
Route::get('/penerima-zakat/print', [PenerimaZakatController::class, 'print'])->name('penerima.print');
Route::get('/penerima-zakat', [PenerimaZakatController::class, 'index'])->name('penerima.index');
Route::post('/penerima-zakat', [PenerimaZakatController::class, 'store'])->name('penerima.store');
Route::post('/penerima-zakat/{id}/update', [PenerimaZakatController::class, 'update'])->name('penerima.update');
Route::post('/penerima-zakat/{id}/destroy', [PenerimaZakatController::class, 'destroy'])->name('penerima.destroy');

// Route untuk konfigurasi jatah
Route::post('/jatah-config', [JatahConfigController::class, 'store'])->name('jatah.store');
Route::post('/jatah-config/apply', [JatahConfigController::class, 'apply'])->name('jatah.apply');

// Route untuk formula jatah
Route::get('/formula-jatah', [FormulaJatahController::class, 'index'])->name('formula-jatah.index');
Route::post('/formula-jatah/store', [FormulaJatahController::class, 'store'])->name('formula-jatah.store');
Route::get('/formula-jatah/latest', [FormulaJatahController::class, 'getLatest'])->name('formula-jatah.latest');

// Route untuk setting beras
Route::get('/setting-beras', [\App\Http\Controllers\SettingBerasController::class, 'index'])->name('setting-beras.index');
Route::post('/setting-beras', [\App\Http\Controllers\SettingBerasController::class, 'store'])->name('setting-beras.store');
Route::post('/setting-beras/{id}/update', [\App\Http\Controllers\SettingBerasController::class, 'update'])->name('setting-beras.update');

// Route untuk laporan belanja
Route::get('/laporan-belanja', [LaporanBelanjaController::class, 'index'])->name('laporan-belanja.index');
Route::post('/laporan-belanja', [LaporanBelanjaController::class, 'store'])->name('laporan-belanja.store');
Route::post('/laporan-belanja/{id}/update', [LaporanBelanjaController::class, 'update'])->name('laporan-belanja.update');
Route::post('/laporan-belanja/{id}/destroy', [LaporanBelanjaController::class, 'destroy'])->name('laporan-belanja.destroy');

Route::get('/zakat/compare-ai', [ZakatCompareController::class, 'compare']);
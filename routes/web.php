<?php

use App\Http\Controllers\ZakatArchiveController;
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
use App\Http\Controllers\ShohibulqurbanController;
use App\Http\Controllers\JatahlembagaqurbanController;
use App\Http\Controllers\PanitiaqurbanController;
use App\Http\Controllers\PenerimaqurbanController;
use App\Http\Controllers\JatahconfigqurbanController;
use App\Http\Controllers\FormulaqurbanController;
use App\Http\Controllers\SettingqurbanController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AiController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\AdminKeuanganController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\KasController;    
use App\Http\Controllers\LaporanKeuanganController;
use App\Http\Controllers\ZakatHomeController;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/infaqdonasi', function () {
    return Inertia::render('InfaqDonasi');
});

Route::get('/laporan-keuangan', [LaporanKeuanganController::class, 'index'])->name('laporan.index');

Route::get('/quran', function () {
    return Inertia::render('Quran');
});

Route::get('/berita', [NewsController::class, 'publicIndex'])->name('berita.index');
Route::get('/berita/{slug}', [NewsController::class, 'publicShow'])->name('berita.show');
Route::post('/berita/{slug}/like', [NewsController::class, 'addLike'])->name('berita.like');
Route::post('/berita/{slug}/komentar', [CommentController::class, 'store'])->name('berita.comment.store');


Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware(['auth', 'role:super admin,admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);

    // ==== MODUL KEUANGAN ====
    Route::get('/keuangan', [AdminKeuanganController::class, 'index'])->name('admin.keuangan.dashboard');


    Route::prefix('keuangan')->name('admin.keuangan.')->group(function () {
        Route::get('/transaksi', [TransaksiController::class, 'index'])->name('transaksi.index');
        Route::post('/transaksi', [TransaksiController::class, 'store'])->name('transaksi.store');
        Route::post('/transaksi/{transaksi}/update', [TransaksiController::class, 'update'])->name('transaksi.update');
        Route::post('/transaksi/{transaksi}/destroy', [TransaksiController::class, 'destroy'])->name('transaksi.destroy');

        Route::post('/kategori/quick', [KategoriController::class, 'quickStore'])->name('kategori.quick');
        Route::post('/kas/quick', [KasController::class, 'quickStore'])->name('kas.quick');
    });

    Route::get('/user', [UserController::class, 'index'])->name('users.index');
    Route::post('/user', [UserController::class, 'store'])->name('users.store');
    Route::post('/user/{id}/update', [UserController::class, 'update'])->name('users.update');
    Route::post('/user/{id}/delete', [UserController::class, 'destroy'])->name('users.destroy');
 
    Route::get('/berita', [NewsController::class, 'adminIndex'])->name('news.index');
    Route::get('/berita/add', [NewsController::class, 'create'])->name('news.create');
    Route::post('/berita', [NewsController::class, 'store'])->name('news.store');
    Route::get('/berita/{news}/edit', [NewsController::class, 'edit'])->name('news.edit');
    Route::post('/berita/{news}', [NewsController::class, 'update'])->name('news.update');
    Route::put('/berita/{news}', [NewsController::class, 'update']); 
    Route::post('/berita/{news}', [NewsController::class, 'destroy'])->name('news.destroy');
    Route::get('/berita/{slug}/komentar', [CommentController::class, 'adminIndex'])->name('admin.comments');
    Route::delete('/komentar/{comment}', [CommentController::class, 'destroy'])->name('admin.comments.destroy');
    Route::post('/ai/generate-news', [AiController::class, 'generateNews'])->name('ai.generate-news');


    Route::get('/iklan', [BannerController::class, 'index'])->name('admin.iklan');
    Route::post('/iklan', [BannerController::class, 'store'])->name('admin.iklan.store');
    Route::post('/iklan/{banner}', [BannerController::class, 'update'])->name('admin.iklan.update');
    Route::post('/iklan/{banner}/toggle', [BannerController::class, 'toggleActive'])->name('admin.iklan.toggle');
    Route::delete('/iklan/{banner}', [BannerController::class, 'destroy'])->name('admin.iklan.destroy');
});


Route::prefix('zakat')->group(function () {
    Route::get('/', [ZakatHomeController::class, 'index'])->name('zakat.home');
    Route::get('/archive/{id}/download', [\App\Http\Controllers\ZakatArchiveController::class, 'download'])->name('zakat.archive.download');
    Route::get('/archive/{id}/download-public', [ZakatArchiveController::class, 'downloadPublic'])->name('zakat.archive.download-public');

    Route::middleware(['auth', 'role:super admin,admin,zakat'])->prefix('input')->group(function () {
        Route::get('/', function () {
            $setting = SettingBeras::first() ?? SettingBeras::create([
                'harga_per_kg' => 0,
                'harga_2_5kg' => 0,
            ]);
            
            return Inertia::render('zakat/InputZakat', [
                'setting' => $setting,
            ]);
        });

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Route untuk pembayar zakat
        Route::get('/pembayar', [PembayarZakatController::class, 'index'])->name('pembayar.index');
        Route::post('/pembayar/store', [PembayarZakatController::class, 'store'])->name('zakat.store');
        Route::post('/pembayar/{id}/update', [PembayarZakatController::class, 'update'])->name('zakat.update');
        Route::post('/pembayar/{id}', [PembayarZakatController::class, 'destroy'])->name('zakat.destroy');
        Route::get('/pembayar/export', [PembayarZakatController::class, 'export'])->name('pembayar.export');

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

        // Route untuk pengarsipan
        Route::post('/archive', [\App\Http\Controllers\ZakatArchiveController::class, 'archive'])->name('zakat.archive.store');
        Route::post('/archive/{id}/destroy', [\App\Http\Controllers\ZakatArchiveController::class, 'destroy'])->name('zakat.archive.destroy');
        

        // Route untuk laporan belanja
        Route::get('/laporan-belanja', [LaporanBelanjaController::class, 'index'])->name('laporan-belanja.index');
        Route::post('/laporan-belanja', [LaporanBelanjaController::class, 'store'])->name('laporan-belanja.store');
        Route::post('/laporan-belanja/{id}/update', [LaporanBelanjaController::class, 'update'])->name('laporan-belanja.update');
        Route::post('/laporan-belanja/{id}/destroy', [LaporanBelanjaController::class, 'destroy'])->name('laporan-belanja.destroy');

        // Route Compare penerima & pembayar
        Route::get('/compare-ai', [ZakatCompareController::class, 'compare']);

        // Route untuk setting printer nota pembayar
        Route::post('/setting-beras/printer', [SettingBerasController::class, 'updatePrinter'])->name('setting.printer.update');
        Route::post('/setting-beras/printer/disconnect', [SettingBerasController::class, 'disconnectPrinter'])->name('setting.printer.disconnect');
    });
});


// qurban route
Route::prefix('qurban')->group(function () {
    Route::get('/', function () {
        return Inertia::render('QurbanHome');
    });

    Route::middleware(['auth', 'role:super admin,admin,qurban'])->prefix('input')->group(function () {
        Route::get('/', function () {
            return Inertia::render('qurban/InputQurban');
        });

        Route::get('/dashboard', [\App\Http\Controllers\QurbanDashboardController::class, 'index'])->name('qurban.dashboard');

        Route::get('/qurban/surat-keterangan/{id}', [PenerimaqurbanController::class, 'suratKeterangan'])->name('qurban.surat-keterangan');


        // shohibul qurban
        Route::get('/shohibul', [ShohibulqurbanController::class, 'index'])->name('shohibul.index');
        Route::get('/shohibul/create', [ShohibulqurbanController::class, 'create'])->name('shohibul.create');
        Route::get('/shohibul/print', [ShohibulqurbanController::class, 'print'])->name('shohibul.print');
        Route::post('/shohibul/store', [ShohibulqurbanController::class, 'store'])->name('shohibul.store');
        Route::post('/shohibul/{shohibulqurban}/update', [ShohibulqurbanController::class, 'update'])->name('shohibul.update');
        Route::post('/shohibul/{shohibulqurban}/destroy', [ShohibulqurbanController::class, 'destroy'])->name('shohibul.destroy');

        // jatah lembaga qurban
        Route::get('/jatah-lembaga', [JatahlembagaqurbanController::class, 'index'])->name('jatah-lembaga.index');
        Route::post('/jatah-lembaga/store', [JatahlembagaqurbanController::class, 'store'])->name('jatah-lembaga.store');
        Route::post('/jatah-lembaga/{jatahlembagaqurban}/update', [JatahlembagaqurbanController::class, 'update'])->name('jatah-lembaga.update');
        Route::post('/jatah-lembaga/{jatahlembagaqurban}/destroy', [JatahlembagaqurbanController::class, 'destroy'])->name('jatah-lembaga.destroy');
        
        // panitia wurban
        Route::get('/panitia', [PanitiaqurbanController::class, 'index'])->name('panitia.index');
        Route::post('/panitia/store', [PanitiaqurbanController::class, 'store'])->name('panitia.store');
        Route::post('/panitia/{panitiaqurban}/update', [PanitiaqurbanController::class, 'update'])->name('panitia.update');
        Route::post('/panitia/{panitiaqurban}/destroy', [PanitiaqurbanController::class, 'destroy'])->name('panitia.destroy');

        // penerima qurban
        Route::get('/penerima/print', [PenerimaqurbanController::class, 'print'])->name('penerima.qurban.print');
        Route::get('/penerima', [PenerimaqurbanController::class, 'index'])->name('penerima.index');
        Route::post('/penerima', [PenerimaqurbanController::class, 'store'])->name('penerima.store');
        Route::post('/penerima/{penerimaqurban}/update', [PenerimaqurbanController::class, 'update'])->name('penerima.update');
        Route::post('/penerima/{penerimaqurban}/destroy', [PenerimaqurbanController::class, 'destroy'])->name('penerima.destroy');


        // Route untuk konfigurasi jatah
        Route::post('/jatah-config', [JatahconfigqurbanController::class, 'store'])->name('qurban.jatah.store');
        Route::post('/jatah-config/apply', [JatahconfigqurbanController::class, 'apply'])->name('qurban.jatah.apply');

        // Route untuk formula jatah qurban
        Route::get('/formula', [FormulaqurbanController::class, 'index'])->name('qurban.formula.index');
        Route::post('/formula/store', [FormulaqurbanController::class, 'store'])->name('qurban.formula.store');
        Route::get('/formula/latest', [FormulaqurbanController::class, 'getLatest'])->name('qurban.formula.latest');

        // scanner
        Route::get('/scan/{kode}', [PenerimaqurbanController::class, 'scan']);
        Route::post('/claim/{kode}', [PenerimaqurbanController::class, 'claim']);   

        // setting qurban
        Route::get('/setting', [SettingqurbanController::class, 'index'])->name('setting.index');
        Route::post('/setting/store', [SettingqurbanController::class, 'store'])->name('setting.store');
        Route::post('/setting/{settingqurban}/update', [SettingqurbanController::class, 'update'])->name('setting.update');
        Route::post('/setting/{settingqurban}/destroy', [SettingqurbanController::class, 'destroy'])->name('setting.destroy');
        Route::post('/setting/printer', [SettingqurbanController::class, 'updatePrinter'])->name('setting.qurban.printer.update');
        Route::post('/setting/printer/disconnect', [SettingqurbanController::class, 'disconnectPrinter'])->name('setting.qurban.printer.disconnect');
    });
});

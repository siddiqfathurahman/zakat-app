<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laporan_belanjas', function (Blueprint $table) {
            $table->id();
            $table->string('panitia');
            $table->date('tanggal');
            $table->integer('jumlah_sak');
            $table->decimal('harga_per_sak', 15, 2);
            $table->decimal('total_belanja', 15, 2); // jumlah_sak * harga_per_sak
            $table->string('nama_penjual');
            $table->decimal('sisa_uang', 15, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan_belanjas');
    }
};
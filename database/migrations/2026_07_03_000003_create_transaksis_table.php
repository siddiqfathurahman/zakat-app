<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaksis', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_transaksi')->unique();
            $table->foreignId('kas_id')->constrained('kas')->cascadeOnDelete();
            $table->foreignId('kategori_id')->constrained('kategori')->cascadeOnDelete();
            $table->enum('jenis', ['income', 'expense']);
            $table->decimal('jumlah', 15, 2);
            $table->date('tanggal');
            $table->text('keterangan')->nullable();
            $table->string('lampiran')->nullable();
            $table->enum('status', ['draft', 'approved', 'rejected'])->default('approved');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['tanggal', 'jenis', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksis');
    }
};

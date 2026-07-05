<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transfers', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_transfer')->unique();
            $table->foreignId('kas_asal_id')->constrained('kas')->cascadeOnDelete();
            $table->foreignId('kas_tujuan_id')->constrained('kas')->cascadeOnDelete();
            $table->decimal('jumlah', 15, 2);
            $table->date('tanggal');
            $table->text('keterangan')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transfers');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('realtime_qurbans', function (Blueprint $table) {
            $table->id();
            $table->string('jenis_hewan'); // sapi / kambing
            $table->integer('nomor_hewan');

            $table->boolean('status_sembelih')->default(false);
            $table->timestamp('waktu_sembelih')->nullable();

            $table->boolean('status_potong')->default(false);
            $table->timestamp('waktu_potong')->nullable();

            $table->boolean('status_timbang')->default(false);
            $table->decimal('berat_kg', 8, 2)->nullable();
            $table->timestamp('waktu_timbang')->nullable();

            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->unique(['jenis_hewan', 'nomor_hewan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('realtime_qurbans');
    }
};
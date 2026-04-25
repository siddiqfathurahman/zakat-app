<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shohibulqurbans', function (Blueprint $table) {
            $table->id();
            $table->string('panitia');
            $table->string('nama');
            $table->string('rt', 10);
            $table->string('rw', 10);
            $table->unsignedInteger('nomor_hewan');
            $table->enum('jenis_hewan', ['sapi', 'kambing', 'domba']);
            $table->string('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shohibulqurbans');
    }
};

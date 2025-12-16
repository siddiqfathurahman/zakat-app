<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pembayar_zakats', function (Blueprint $table) {
            $table->id();
            $table->string('panitia');
            $table->string('nama');
            $table->string('rt', 10);
            $table->string('rw', 10);
            $table->integer('jumlah_jiwa');
            $table->enum('melalui', ['uang', 'beras']);
            $table->decimal('nilai_per_jiwa', 15, 2);
            $table->decimal('total', 15, 2);
            $table->decimal('sodaqoh', 15, 2)->nullable()->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pembayar_zakats');
    }
};
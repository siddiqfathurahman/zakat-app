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
        Schema::create('jatahlembagaqurbans', function (Blueprint $table) {
            $table->id();
            $table->string('nama_lembaga');
            $table->integer('jumlah_sapi');
            $table->integer('jumlah_kambing');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jatahlembagaqurbans');
    }
};

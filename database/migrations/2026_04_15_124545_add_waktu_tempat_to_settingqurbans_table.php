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
        Schema::table('settingqurbans', function (Blueprint $table) {
            $table->string('tanggal_pengambilan')->nullable();
            $table->string('waktu_pengambilan')->nullable();
            $table->string('tempat_pengambilan')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settingqurbans', function (Blueprint $table) {
            $table->dropColumn(['tanggal_pengambilan', 'waktu_pengambilan', 'tempat_pengambilan']);
        });
    }
};

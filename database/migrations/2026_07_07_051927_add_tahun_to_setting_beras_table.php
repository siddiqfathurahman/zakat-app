<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('setting_beras', function (Blueprint $table) {
            $table->integer('tahun')->nullable()->after('toko');
        });
    }

    public function down(): void
    {
        Schema::table('setting_beras', function (Blueprint $table) {
            $table->dropColumn('tahun');
        });
    }
};
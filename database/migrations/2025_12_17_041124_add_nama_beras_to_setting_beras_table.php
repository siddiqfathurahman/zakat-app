<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('setting_beras', function (Blueprint $table) {
            $table->string('toko')->after('id');
            $table->string('harga_sak')->after('harga_2_5kg');
        });
    }

    public function down(): void
    {
        Schema::table('setting_beras', function (Blueprint $table) {
            $table->dropColumn(['toko', 'harga_sak']);
        });
    }
};

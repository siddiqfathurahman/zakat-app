<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shohibulqurbans', function (Blueprint $table) {
            $table->boolean('status_kirim')->default(false)->after('nomor_hewan');
            $table->timestamp('waktu_kirim')->nullable()->after('status_kirim');
        });
    }

    public function down(): void
    {
        Schema::table('shohibulqurbans', function (Blueprint $table) {
            $table->dropColumn(['status_kirim', 'waktu_kirim']);
        });
    }
};
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
            $table->boolean('printer_connected')->default(false)->after('tempat_pengambilan');
            $table->string('printer_name')->nullable()->after('printer_connected');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settingqurbans', function (Blueprint $table) {
            $table->dropColumn(['printer_connected', 'printer_name']);
        });
    }
};

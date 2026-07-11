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
            $table->text('note_kulit')->nullable()->after('jual_kulit');
            $table->integer('tahun')->after('operasional_kambing');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settingqurbans', function (Blueprint $table) {
            $table->dropColumn(['note_kulit', 'tahun']);
        });
    }
};
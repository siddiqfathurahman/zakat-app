<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('zakat_archives', function (Blueprint $table) {
            $table->string('file_path_public')->nullable()->after('file_path');
        });
    }

    public function down(): void
    {
        Schema::table('zakat_archives', function (Blueprint $table) {
            $table->dropColumn('file_path_public');
        });
    }
};
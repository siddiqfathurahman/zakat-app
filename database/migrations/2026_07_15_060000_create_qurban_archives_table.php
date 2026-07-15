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
        Schema::create('qurban_archives', function (Blueprint $table) {
            $table->id();
            $table->integer('tahun')->unique();
            $table->string('file_path');
            $table->string('file_path_public')->nullable();
            $table->json('summary_data')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qurban_archives');
    }
};

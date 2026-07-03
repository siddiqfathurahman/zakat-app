<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_views', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('total')->default(0);
            $table->timestamps();
        });

        // Insert 1 record awal
        DB::table('site_views')->insert(['total' => 0]);
    }

    public function down(): void
    {
        Schema::dropIfExists('site_views');
    }
};
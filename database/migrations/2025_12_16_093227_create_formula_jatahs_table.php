<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('formula_jatah', function (Blueprint $table) {
            $table->id();
            $table->integer('jumlah_total_bungkus');
            $table->integer('sisa_pembagian');
            $table->integer('jiwa_1_count')->default(0);
            $table->integer('jiwa_2_count')->default(0);
            $table->integer('jiwa_3_count')->default(0);
            $table->integer('jiwa_4_count')->default(0);
            $table->integer('jiwa_5_plus_count')->default(0);
            $table->integer('sim_jatah_1')->default(1);
            $table->integer('sim_jatah_2')->default(2);
            $table->integer('sim_jatah_3')->default(3);
            $table->integer('sim_jatah_4')->default(4);
            $table->integer('sim_jatah_5_plus')->default(5);
            $table->integer('total_sim_jatah_1')->default(0);
            $table->integer('total_sim_jatah_2')->default(0);
            $table->integer('total_sim_jatah_3')->default(0);
            $table->integer('total_sim_jatah_4')->default(0);
            $table->integer('total_sim_jatah_5_plus')->default(0);
            $table->integer('total_keseluruhan')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('formula_jatah');
    }
};
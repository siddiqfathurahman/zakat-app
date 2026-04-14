<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('formulaqurbans', function (Blueprint $table) {
            $table->id();
            // Inputs
            $table->integer('total_bungkus_sapi')->default(0);
            $table->integer('total_bungkus_kambing')->default(0);

            // Remainders
            $table->integer('sisa_pembagian_sapi')->default(0);
            $table->integer('sisa_pembagian_kambing')->default(0);

            // Population counts
            $table->integer('count_1')->default(0);
            $table->integer('count_2')->default(0);
            $table->integer('count_3')->default(0);
            $table->integer('count_4')->default(0);
            $table->integer('count_5_plus')->default(0);
            $table->integer('count_nonmuslim')->default(0);

            // Simulation Inputs (Muslim)
            $table->integer('sim_sapi_1')->default(0);
            $table->integer('sim_kambing_1')->default(0);
            $table->integer('sim_sapi_2')->default(0);
            $table->integer('sim_kambing_2')->default(0);
            $table->integer('sim_sapi_3')->default(0);
            $table->integer('sim_kambing_3')->default(0);
            $table->integer('sim_sapi_4')->default(0);
            $table->integer('sim_kambing_4')->default(0);
            $table->integer('sim_sapi_5_plus')->default(0);
            $table->integer('sim_kambing_5_plus')->default(0);

            // Simulation Inputs (Non-Muslim)
            $table->integer('sim_sapi_nonmuslim')->default(0);
            $table->integer('sim_kambing_nonmuslim')->default(0);

            // Totals Used
            $table->integer('total_sim_sapi_1')->default(0);
            $table->integer('total_sim_kambing_1')->default(0);
            $table->integer('total_sim_sapi_2')->default(0);
            $table->integer('total_sim_kambing_2')->default(0);
            $table->integer('total_sim_sapi_3')->default(0);
            $table->integer('total_sim_kambing_3')->default(0);
            $table->integer('total_sim_sapi_4')->default(0);
            $table->integer('total_sim_kambing_4')->default(0);
            $table->integer('total_sim_sapi_5_plus')->default(0);
            $table->integer('total_sim_kambing_5_plus')->default(0);
            
            $table->integer('total_sim_sapi_nonmuslim')->default(0);
            $table->integer('total_sim_kambing_nonmuslim')->default(0);

            $table->integer('total_keseluruhan_sapi')->default(0);
            $table->integer('total_keseluruhan_kambing')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('formulaqurbans');
    }
};

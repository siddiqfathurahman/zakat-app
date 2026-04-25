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
        Schema::create('jatahconfigqurbans', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('jiwa'); // 1,2,3,4,5 (5 = >=5)
            $table->unsignedInteger('jatah_sapi')->nullable()->default(0);
            $table->unsignedInteger('jatah_kambing')->nullable()->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jatahconfigqurbans');
    }
};

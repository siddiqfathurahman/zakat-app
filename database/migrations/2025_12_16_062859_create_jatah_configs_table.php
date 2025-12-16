<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('jatah_configs', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('jiwa'); // 1,2,3,4,5 (5 = >=5)
            $table->unsignedInteger('jatah')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jatah_configs');
    }
};


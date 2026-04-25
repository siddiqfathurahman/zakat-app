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
        Schema::create('penerimaqurbans', function (Blueprint $table) {
            $table->id();

            $table->string('nama');
            $table->string('rt', 5);
            $table->string('rw', 5);

            $table->enum('agama', ['muslim', 'nonmuslim']);
            $table->unsignedInteger('jiwa');

            $table->unsignedInteger('jatah_sapi')->nullable();
            $table->unsignedInteger('jatah_kambing')->nullable();

            //  KODE UNIK (untuk logic & scan)
            $table->uuid('kode_unik')->unique();

            //  QR CODE (opsional: simpan path / base64)
            $table->text('qr_code')->nullable();

            $table->enum('status', ['pending', 'claimed', 'shohibul'])
                ->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penerimaqurbans');
    }
};

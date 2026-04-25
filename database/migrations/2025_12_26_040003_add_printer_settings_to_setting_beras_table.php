<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('setting_beras', function (Blueprint $table) {
            $table->boolean('printer_connected')->default(false);
            $table->string('printer_name')->nullable();
            $table->string('printer_type')->nullable(); // bluetooth, usb, network
            $table->string('printer_address')->nullable();
        });
    }

    public function down()
    {
        Schema::table('setting_beras', function (Blueprint $table) {
            $table->dropColumn(['printer_connected', 'printer_name', 'printer_type', 'printer_address']);
        });
    }
};
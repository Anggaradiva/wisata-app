<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tempat_wisata', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->text('deskripsi');
            $table->string('lokasi');
            $table->string('gambar')->nullable();
            $table->decimal('harga_tiket', 10, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('kendaraan', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('tipe');
            $table->integer('kapasitas');
            $table->decimal('harga_per_hari', 10, 2);
            $table->string('gambar')->nullable();
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });

        Schema::create('sopir', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('no_hp');
            $table->string('foto')->nullable();
            $table->text('pengalaman')->nullable();
            $table->boolean('is_available')->default(true);
            $table->decimal('rating', 2, 1)->default(5.0);
            $table->timestamps();
        });

        Schema::create('booking', function (Blueprint $table) {
            $table->id();
            $table->string('kode_booking')->unique();
            $table->string('nama_pemesan');
            $table->string('no_hp');
            $table->string('email')->nullable();
            $table->foreignId('tempat_wisata_id')->constrained('tempat_wisata')->onDelete('cascade');
            $table->foreignId('kendaraan_id')->constrained('kendaraan')->onDelete('cascade');
            $table->foreignId('sopir_id')->nullable()->constrained('sopir')->onDelete('set null');
            $table->date('tanggal_berangkat');
            $table->date('tanggal_kembali');
            $table->integer('jumlah_hari');
            $table->integer('jumlah_orang');
            $table->decimal('total_harga', 10, 2);
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booking');
        Schema::dropIfExists('sopir');
        Schema::dropIfExists('kendaraan');
        Schema::dropIfExists('tempat_wisata');
    }
};
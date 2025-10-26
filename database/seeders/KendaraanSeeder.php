<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kendaraan;

class KendaraanSeeder extends Seeder
{
    public function run(): void
    {
        $kendaraan = [
            [
                'nama' => 'Toyota Avanza',
                'tipe' => 'MPV',
                'kapasitas' => 7,
                'harga_per_hari' => 350000,
                'is_available' => true,
            ],
            [
                'nama' => 'Toyota Innova Reborn',
                'tipe' => 'MPV',
                'kapasitas' => 7,
                'harga_per_hari' => 450000,
                'is_available' => true,
            ],
            [
                'nama' => 'Toyota Hiace Premio',
                'tipe' => 'Bus',
                'kapasitas' => 14,
                'harga_per_hari' => 800000,
                'is_available' => true,
            ],
            [
                'nama' => 'Honda Freed',
                'tipe' => 'MPV',
                'kapasitas' => 6,
                'harga_per_hari' => 400000,
                'is_available' => true,
            ],
            [
                'nama' => 'Suzuki Ertiga',
                'tipe' => 'MPV',
                'kapasitas' => 7,
                'harga_per_hari' => 320000,
                'is_available' => true,
            ],
            [
                'nama' => 'Toyota Alphard',
                'tipe' => 'Luxury MPV',
                'kapasitas' => 7,
                'harga_per_hari' => 1200000,
                'is_available' => true,
            ],
            [
                'nama' => 'Honda PCX 160',
                'tipe' => 'Motor',
                'kapasitas' => 2,
                'harga_per_hari' => 80000,
                'is_available' => true,
            ],
            [
                'nama' => 'Yamaha Nmax',
                'tipe' => 'Motor',
                'kapasitas' => 2,
                'harga_per_hari' => 75000,
                'is_available' => true,
            ],
        ];

        foreach ($kendaraan as $kend) {
            Kendaraan::create($kend);
        }
    }
}
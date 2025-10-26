<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TempatWisata;

class TempatWisataSeeder extends Seeder
{
    public function run(): void
    {
        $tempatWisata = [
            [
                'nama' => 'Pantai Kuta',
                'deskripsi' => 'Pantai terkenal di Bali dengan pemandangan sunset yang indah dan ombak yang cocok untuk surfing',
                'lokasi' => 'Kuta, Badung, Bali',
                'harga_tiket' => 50000,
                'is_active' => true,
            ],
            [
                'nama' => 'Tanah Lot',
                'deskripsi' => 'Pura di atas batu karang dengan pemandangan laut yang menakjubkan, destinasi sunset terbaik',
                'lokasi' => 'Beraban, Tabanan, Bali',
                'harga_tiket' => 60000,
                'is_active' => true,
            ],
            [
                'nama' => 'Ubud Monkey Forest',
                'deskripsi' => 'Hutan lindung dengan ratusan monyet dan pura kuno yang eksotis',
                'lokasi' => 'Ubud, Gianyar, Bali',
                'harga_tiket' => 80000,
                'is_active' => true,
            ],
            [
                'nama' => 'Tegalalang Rice Terrace',
                'deskripsi' => 'Sawah terasering dengan pemandangan yang instagramable dan ayunan di atas lembah',
                'lokasi' => 'Tegalalang, Gianyar, Bali',
                'harga_tiket' => 45000,
                'is_active' => true,
            ],
            [
                'nama' => 'Uluwatu Temple',
                'deskripsi' => 'Pura di tebing karang dengan pertunjukan tari Kecak saat sunset',
                'lokasi' => 'Uluwatu, Badung, Bali',
                'harga_tiket' => 75000,
                'is_active' => true,
            ],
            [
                'nama' => 'Nusa Penida',
                'deskripsi' => 'Pulau cantik dengan pantai-pantai eksotis seperti Kelingking Beach dan Crystal Bay',
                'lokasi' => 'Nusa Penida, Klungkung, Bali',
                'harga_tiket' => 100000,
                'is_active' => true,
            ],
            [
                'nama' => 'Bedugul',
                'deskripsi' => 'Danau Beratan dengan Pura Ulun Danu yang ikonik, udara sejuk pegunungan',
                'lokasi' => 'Bedugul, Tabanan, Bali',
                'harga_tiket' => 55000,
                'is_active' => true,
            ],
            [
                'nama' => 'Seminyak Beach',
                'deskripsi' => 'Pantai dengan beach club mewah, sunset bar, dan shopping area',
                'lokasi' => 'Seminyak, Badung, Bali',
                'harga_tiket' => 40000,
                'is_active' => true,
            ],
        ];

        foreach ($tempatWisata as $wisata) {
            TempatWisata::create($wisata);
        }
    }
}
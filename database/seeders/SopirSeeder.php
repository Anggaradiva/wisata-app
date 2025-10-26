<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sopir;

class SopirSeeder extends Seeder
{
    public function run(): void
    {
        $sopir = [
            [
                'nama' => 'Made Suarta',
                'no_hp' => '081234567890',
                'pengalaman' => '10 tahun pengalaman sebagai driver wisata, mengenal seluruh Bali dengan baik',
                'is_available' => true,
                'rating' => 4.9,
            ],
            [
                'nama' => 'Wayan Kerta',
                'no_hp' => '081234567891',
                'pengalaman' => '8 tahun pengalaman, ramah dan bisa berbahasa Inggris dengan lancar',
                'is_available' => true,
                'rating' => 4.8,
            ],
            [
                'nama' => 'Ketut Bagus',
                'no_hp' => '081234567892',
                'pengalaman' => '12 tahun pengalaman, spesialis tour ke Ubud dan sekitarnya',
                'is_available' => true,
                'rating' => 5.0,
            ],
            [
                'nama' => 'Nyoman Adi',
                'no_hp' => '081234567893',
                'pengalaman' => '6 tahun pengalaman, sopir muda yang energik dan penuh semangat',
                'is_available' => true,
                'rating' => 4.7,
            ],
            [
                'nama' => 'Komang Yasa',
                'no_hp' => '081234567894',
                'pengalaman' => '15 tahun pengalaman, ahli jalur menuju pantai-pantai tersembunyi',
                'is_available' => true,
                'rating' => 4.9,
            ],
        ];

        foreach ($sopir as $sop) {
            Sopir::create($sop);
        }
    }
}
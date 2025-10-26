<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TempatWisata extends Model
{
    use HasFactory;

    protected $table = 'tempat_wisata';
    
    protected $fillable = [
        'nama',
        'deskripsi',
        'lokasi',
        'gambar',
        'harga_tiket',
        'is_active'
    ];

    protected $casts = [
        'harga_tiket' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kendaraan extends Model
{
    use HasFactory;

    protected $table = 'kendaraan';
    
    protected $fillable = [
        'nama',
        'tipe',
        'kapasitas',
        'harga_per_hari',
        'gambar',
        'is_available'
    ];

    protected $casts = [
        'harga_per_hari' => 'decimal:2',
        'is_available' => 'boolean',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
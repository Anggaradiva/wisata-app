<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $table = 'booking';
    
    protected $fillable = [
        'kode_booking',
        'nama_pemesan',
        'no_hp',
        'email',
        'tempat_wisata_id',
        'kendaraan_id',
        'sopir_id',
        'tanggal_berangkat',
        'tanggal_kembali',
        'jumlah_hari',
        'jumlah_orang',
        'total_harga',
        'status'
    ];

    protected $casts = [
        'tanggal_berangkat' => 'date',
        'tanggal_kembali' => 'date',
        'total_harga' => 'decimal:2',
    ];

    public function tempatWisata()
    {
        return $this->belongsTo(TempatWisata::class);
    }

    public function kendaraan()
    {
        return $this->belongsTo(Kendaraan::class);
    }

    public function sopir()
    {
        return $this->belongsTo(Sopir::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($booking) {
            $booking->kode_booking = 'WS-' . strtoupper(uniqid());
        });
    }
}
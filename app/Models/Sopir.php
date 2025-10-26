<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sopir extends Model
{
    use HasFactory;

    protected $table = 'sopir';
    
    protected $fillable = [
        'nama',
        'no_hp',
        'foto',
        'pengalaman',
        'is_available',
        'rating'
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'rating' => 'decimal:1',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
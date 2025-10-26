<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\WhatsAppController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [BookingController::class, 'index'])->name('home');

Route::prefix('booking')->group(function () {
    Route::post('/', [BookingController::class, 'store'])->name('booking.store');
    Route::get('/{id}', [BookingController::class, 'show'])->name('booking.show');
});

Route::post('/whatsapp/send/{booking}', [WhatsAppController::class, 'sendNota'])->name('whatsapp.send');

require __DIR__.'/auth.php';
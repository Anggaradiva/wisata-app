<?php

use App\Http\Controllers\BookingController;
use Illuminate\Support\Facades\Route;

Route::get('/', [BookingController::class, 'index'])->name('home');

Route::prefix('booking')->group(function () {
    Route::post('/', [BookingController::class, 'store'])->name('booking.store');
    Route::get('/{id}', [BookingController::class, 'show'])->name('booking.show');
    Route::get('/{id}/success', [BookingController::class, 'success'])->name('booking.success');
});

require __DIR__.'/auth.php';
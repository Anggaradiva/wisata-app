<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\AIController;
use Illuminate\Support\Facades\Route;

Route::get('/', [BookingController::class, 'index'])->name('home');

Route::prefix('booking')->group(function () {
    Route::post('/', [BookingController::class, 'store'])->name('booking.store');
    Route::get('/{id}', [BookingController::class, 'show'])->name('booking.show');
    Route::get('/{id}/success', [BookingController::class, 'success'])->name('booking.success');
});

// ========================================
// AI ASSISTANT ROUTES - TAMBAHKAN INI
// ========================================
Route::prefix('ai')->group(function () {
    Route::post('/chat', [AIController::class, 'chat'])->name('ai.chat');
    Route::post('/clear-history', [AIController::class, 'clearHistory'])->name('ai.clear');
});

require __DIR__.'/auth.php';

// ========================================
// INSTRUKSI:
// ========================================
// Buka file routes/web.php
// Tambahkan:
// 1. use App\Http\Controllers\AIController; (di atas)
// 2. Route::prefix('ai') section (setelah booking routes)
// Atau replace semua dengan code di atas
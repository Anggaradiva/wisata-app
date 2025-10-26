<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WhatsAppController extends Controller
{
    public function sendNota(Request $request, $bookingId)
    {
        try {
            Log::info('Starting nota generation', ['booking_id' => $bookingId]);

            $booking = Booking::with(['tempatWisata', 'kendaraan', 'sopir'])
                ->findOrFail($bookingId);

            $nota = $this->formatNota($booking);

            // TESTING MODE - Simpan ke file & log
            $this->saveNotaToFile($booking, $nota);
            
            Log::info('✅ Nota berhasil dibuat (Testing Mode)', [
                'booking_id' => $bookingId,
                'kode_booking' => $booking->kode_booking,
                'phone' => $booking->no_hp,
                'timestamp' => now()->toDateTimeString()
            ]);

            return response()->json([
                'success' => true,
                'message' => '✅ Nota berhasil dibuat! (Testing Mode - Check storage/app/public/notas)',
                'data' => [
                    'booking_id' => $booking->id,
                    'kode_booking' => $booking->kode_booking,
                    'nota_preview' => $nota,
                    'nota_file' => asset("storage/notas/nota_{$booking->kode_booking}.txt")
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('❌ Error creating nota', [
                'booking_id' => $bookingId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat nota',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    private function formatNota($booking)
    {
        $sopirInfo = $booking->sopir 
            ? "\n🚗 Sopir: {$booking->sopir->nama}\n📱 HP Sopir: {$booking->sopir->no_hp}" 
            : "\n🚗 Sopir: Tanpa Sopir";

        $nota = "
╔════════════════════════════════╗
     NOTA BOOKING WISATA
╚════════════════════════════════╝

📝 Kode Booking: {$booking->kode_booking}
📅 Tanggal Booking: " . now()->format('d M Y H:i') . "

════════════════════════════════
👤 DATA PEMESAN
════════════════════════════════
Nama    : {$booking->nama_pemesan}
No. HP  : {$booking->no_hp}
Email   : " . ($booking->email ?? '-') . "

════════════════════════════════
🏝️ DETAIL WISATA
════════════════════════════════
Tujuan         : {$booking->tempatWisata->nama}
Lokasi         : {$booking->tempatWisata->lokasi}
Tanggal Pergi  : " . $booking->tanggal_berangkat->format('d M Y') . "
Tanggal Kembali: " . $booking->tanggal_kembali->format('d M Y') . "
Durasi         : {$booking->jumlah_hari} hari
Jumlah Orang   : {$booking->jumlah_orang} orang

════════════════════════════════
🚙 KENDARAAN
════════════════════════════════
Kendaraan : {$booking->kendaraan->nama}
Tipe      : {$booking->kendaraan->tipe}
Kapasitas : {$booking->kendaraan->kapasitas} orang{$sopirInfo}

════════════════════════════════
💰 RINCIAN BIAYA
════════════════════════════════
🎫 Tiket Wisata ({$booking->jumlah_orang} orang)
   Rp " . number_format($booking->tempatWisata->harga_tiket, 0, ',', '.') . " x {$booking->jumlah_orang}
   = Rp " . number_format($booking->tempatWisata->harga_tiket * $booking->jumlah_orang, 0, ',', '.') . "

🚗 Sewa Kendaraan ({$booking->jumlah_hari} hari)
   Rp " . number_format($booking->kendaraan->harga_per_hari, 0, ',', '.') . " x {$booking->jumlah_hari}
   = Rp " . number_format($booking->kendaraan->harga_per_hari * $booking->jumlah_hari, 0, ',', '.') . "

────────────────────────────────
💵 TOTAL: Rp " . number_format($booking->total_harga, 0, ',', '.') . "
════════════════════════════════

✅ Status: " . strtoupper($booking->status) . "

────────────────────────────────
Terima kasih telah memesan!
Selamat menikmati liburan Anda! 🙏
════════════════════════════════
        ";

        return trim($nota);
    }

    private function saveNotaToFile($booking, $nota)
    {
        try {
            $notasPath = storage_path('app/public/notas');
            if (!file_exists($notasPath)) {
                mkdir($notasPath, 0755, true);
            }

            $fileName = "nota_{$booking->kode_booking}.txt";
            $filePath = "{$notasPath}/{$fileName}";
            file_put_contents($filePath, $nota);

            Log::info('📄 Nota saved to file', [
                'file' => $fileName,
                'path' => $filePath
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('❌ Error saving nota to file: ' . $e->getMessage());
            return false;
        }
    }
}
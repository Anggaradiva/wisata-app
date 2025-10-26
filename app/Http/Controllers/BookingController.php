<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\TempatWisata;
use App\Models\Kendaraan;
use App\Models\Sopir;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class BookingController extends Controller
{
    public function index()
    {
        try {
            $tempatWisata = TempatWisata::where('is_active', true)->get();
            $kendaraan = Kendaraan::where('is_available', true)->get();
            $sopir = Sopir::where('is_available', true)->get();

            Log::info('Booking page loaded', [
                'wisata_count' => $tempatWisata->count(),
                'kendaraan_count' => $kendaraan->count(),
                'sopir_count' => $sopir->count(),
            ]);

            return Inertia::render('Booking/Index', [
                'tempatWisata' => $tempatWisata,
                'kendaraan' => $kendaraan,
                'sopir' => $sopir,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading booking page: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan saat memuat halaman');
        }
    }

    public function store(Request $request)
    {
        try {
            Log::info('Creating new booking', ['request_data' => $request->except(['password'])]);

            $validated = $request->validate([
                'nama_pemesan' => 'required|string|max:255',
                'no_hp' => 'required|string|max:20',
                'email' => 'nullable|email',
                'tempat_wisata_id' => 'required|exists:tempat_wisata,id',
                'kendaraan_id' => 'required|exists:kendaraan,id',
                'sopir_id' => 'nullable|exists:sopir,id',
                'tanggal_berangkat' => 'required|date|after_or_equal:today',
                'tanggal_kembali' => 'required|date|after_or_equal:tanggal_berangkat',
                'jumlah_orang' => 'required|integer|min:1',
            ]);

            DB::beginTransaction();

            $tanggalBerangkat = Carbon::parse($validated['tanggal_berangkat']);
            $tanggalKembali = Carbon::parse($validated['tanggal_kembali']);
            $jumlahHari = $tanggalBerangkat->diffInDays($tanggalKembali) + 1;

            $tempatWisata = TempatWisata::findOrFail($validated['tempat_wisata_id']);
            $kendaraan = Kendaraan::findOrFail($validated['kendaraan_id']);

            $hargaTiket = $tempatWisata->harga_tiket * $validated['jumlah_orang'];
            $hargaKendaraan = $kendaraan->harga_per_hari * $jumlahHari;
            $totalHarga = $hargaTiket + $hargaKendaraan;

            $validated['jumlah_hari'] = $jumlahHari;
            $validated['total_harga'] = $totalHarga;

            $booking = Booking::create($validated);

            DB::commit();

            Log::info('Booking created successfully', [
                'booking_id' => $booking->id,
                'kode_booking' => $booking->kode_booking,
                'total_harga' => $booking->total_harga
            ]);

            // Generate nota (TXT + PDF) - FIXED!
            $notaData = null;
            try {
                $whatsappController = app()->make(WhatsAppController::class);
                $notaResponse = $whatsappController->sendNota($request, $booking->id);
                $notaData = $notaResponse->getData();
            } catch (\Exception $e) {
                Log::error('Error generating nota', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Booking berhasil dibuat',
                'data' => [
                    'booking' => $booking->load(['tempatWisata', 'kendaraan', 'sopir']),
                    'nota' => $notaData,
                    'redirect_url' => route('booking.success', $booking->id)
                ]
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in booking', ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating booking', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat membuat booking',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $booking = Booking::with(['tempatWisata', 'kendaraan', 'sopir'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $booking
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching booking', [
                'booking_id' => $id,
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Booking tidak ditemukan'
            ], 404);
        }
    }

    public function success($id)
    {
        try {
            $booking = Booking::with(['tempatWisata', 'kendaraan', 'sopir'])
                ->findOrFail($id);

            $pdfUrl = Storage::url('notas/nota-' . $booking->kode_booking . '.pdf');

            Log::info('Success page loaded', [
                'booking_id' => $id,
                'kode_booking' => $booking->kode_booking
            ]);

            return Inertia::render('Booking/Success', [
                'booking' => $booking,
                'pdfUrl' => $pdfUrl
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading success page', [
                'booking_id' => $id,
                'error' => $e->getMessage()
            ]);
            return redirect()->route('home')->with('error', 'Booking tidak ditemukan');
        }
    }
}
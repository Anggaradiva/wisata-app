<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice - {{ $booking->kode_booking }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 15px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
        }
        h1 {
            font-size: 32px;
            margin: 10px 0;
        }
        .info-box {
            background: #f3f4f6;
            padding: 15px;
            margin: 20px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        table td {
            padding: 8px;
            border-bottom: 1px solid #e5e7eb;
        }
        table td:first-child {
            font-weight: bold;
            width: 150px;
        }
        .section-title {
            background: #2563eb;
            color: white;
            padding: 10px;
            font-weight: bold;
            margin-top: 20px;
        }
        .total {
            background: #2563eb;
            color: white;
            padding: 15px;
            font-size: 18px;
            font-weight: bold;
            margin-top: 20px;
            text-align: right;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🏝️ WISATA INDONESIA</div>
        <div style="font-size: 12px; color: #666;">Eksplorasi Keindahan Nusantara</div>
        <h1>INVOICE</h1>
        <div><strong>Kode: {{ $booking->kode_booking }}</strong></div>
        <div style="font-size: 12px;">{{ now()->format('d F Y, H:i') }} WIB</div>
    </div>

    <div class="info-box">
        <strong>BILL TO:</strong><br>
        <strong style="font-size: 16px;">{{ $booking->nama_pemesan }}</strong><br>
        📱 {{ $booking->no_hp }}<br>
        @if($booking->email)
        ✉️ {{ $booking->email }}
        @endif
    </div>

    <div class="section-title">🏝️ DETAIL PERJALANAN</div>
    <table>
        <tr>
            <td>Destinasi</td>
            <td>{{ $booking->tempatWisata->nama }}</td>
        </tr>
        <tr>
            <td>Lokasi</td>
            <td>{{ $booking->tempatWisata->lokasi }}</td>
        </tr>
        <tr>
            <td>Tanggal Berangkat</td>
            <td>{{ $booking->tanggal_berangkat->format('d F Y') }}</td>
        </tr>
        <tr>
            <td>Tanggal Kembali</td>
            <td>{{ $booking->tanggal_kembali->format('d F Y') }}</td>
        </tr>
        <tr>
            <td>Durasi</td>
            <td>{{ $booking->jumlah_hari }} hari</td>
        </tr>
        <tr>
            <td>Jumlah Orang</td>
            <td>{{ $booking->jumlah_orang }} orang</td>
        </tr>
    </table>

    <div class="section-title">🚗 TRANSPORTASI</div>
    <table>
        <tr>
            <td>Kendaraan</td>
            <td>{{ $booking->kendaraan->nama }}</td>
        </tr>
        <tr>
            <td>Tipe</td>
            <td>{{ $booking->kendaraan->tipe }}</td>
        </tr>
        <tr>
            <td>Kapasitas</td>
            <td>{{ $booking->kendaraan->kapasitas }} orang</td>
        </tr>
        <tr>
            <td>Sopir</td>
            <td>
                @if($booking->sopir)
                    {{ $booking->sopir->nama }} (⭐ {{ $booking->sopir->rating }})
                @else
                    Tanpa Sopir (Self Drive)
                @endif
            </td>
        </tr>
    </table>

    <div class="section-title">💰 RINCIAN BIAYA</div>
    <table>
        <tr>
            <td>Tiket Wisata</td>
            <td style="text-align: right;">
                {{ $booking->jumlah_orang }} orang × Rp {{ number_format($booking->tempatWisata->harga_tiket, 0, ',', '.') }}
                = <strong>Rp {{ number_format($booking->tempatWisata->harga_tiket * $booking->jumlah_orang, 0, ',', '.') }}</strong>
            </td>
        </tr>
        <tr>
            <td>Sewa Kendaraan</td>
            <td style="text-align: right;">
                {{ $booking->jumlah_hari }} hari × Rp {{ number_format($booking->kendaraan->harga_per_hari, 0, ',', '.') }}
                = <strong>Rp {{ number_format($booking->kendaraan->harga_per_hari * $booking->jumlah_hari, 0, ',', '.') }}</strong>
            </td>
        </tr>
    </table>

    <div class="total">
        TOTAL PEMBAYARAN: Rp {{ number_format($booking->total_harga, 0, ',', '.') }}
    </div>

    <div style="text-align: center; margin-top: 20px; padding: 10px; background: #fef3c7; border: 2px solid #f59e0b;">
        <strong>Status: {{ strtoupper($booking->status) }}</strong>
    </div>

    <div class="footer">
        <p><strong>✨ Terima kasih telah memesan!</strong></p>
        <p>Selamat menikmati liburan Anda! 🙏</p>
        <p>📞 0812-3456-7890 | www.wisataindonesia.com</p>
    </div>
</body>
</html>
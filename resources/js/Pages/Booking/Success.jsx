//Success.jsx
import { Head } from '@inertiajs/react';

export default function BookingSuccess({ booking, pdfUrl }) {
    const handleDownloadPDF = () => {
        window.open(pdfUrl, '_blank');
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head title="Booking Berhasil" />
            
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Success Header */}
                    <div className="text-center mb-8 animate-fadeIn">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4 animate-bounce">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">🎉 Booking Berhasil!</h1>
                        <p className="text-gray-600">Pesanan Anda telah dikonfirmasi</p>
                    </div>

                    {/* Invoice Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 print:shadow-none">
                        {/* Header */}
                        <div className="text-center border-b-2 border-gray-200 pb-6 mb-6">
                            <div className="text-2xl font-bold text-blue-600 mb-2">🏝️ WISATA INDONESIA</div>
                            <div className="text-sm text-gray-500">Eksplorasi Keindahan Nusantara</div>
                            <div className="text-3xl font-bold mt-4">INVOICE</div>
                            <div className="mt-2">
                                <span className="text-sm">Kode Booking: </span>
                                <span className="font-bold text-lg text-blue-600">{booking.kode_booking}</span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                {new Date().toLocaleString('id-ID', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })} WIB
                            </div>
                        </div>

                        {/* Bill To */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="font-semibold text-gray-700 mb-2">BILL TO:</div>
                            <div className="font-bold text-lg">{booking.nama_pemesan}</div>
                            <div className="text-sm text-gray-600">📱 {booking.no_hp}</div>
                            {booking.email && (
                                <div className="text-sm text-gray-600">✉️ {booking.email}</div>
                            )}
                        </div>

                        {/* Detail Perjalanan */}
                        <div className="mb-6">
                            <div className="bg-blue-600 text-white px-4 py-2 font-semibold rounded-t-lg">
                                🏝️ DETAIL PERJALANAN
                            </div>
                            <div className="border border-t-0 border-gray-200 rounded-b-lg">
                                <div className="grid grid-cols-2 gap-4 p-4">
                                    <div>
                                        <div className="text-sm text-gray-600">Destinasi</div>
                                        <div className="font-semibold">{booking.tempat_wisata.nama}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Lokasi</div>
                                        <div className="font-semibold">{booking.tempat_wisata.lokasi}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Tanggal Berangkat</div>
                                        <div className="font-semibold">
                                            {new Date(booking.tanggal_berangkat).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Tanggal Kembali</div>
                                        <div className="font-semibold">
                                            {new Date(booking.tanggal_kembali).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Durasi</div>
                                        <div className="font-semibold">{booking.jumlah_hari} hari</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Jumlah Orang</div>
                                        <div className="font-semibold">{booking.jumlah_orang} orang</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transportasi */}
                        <div className="mb-6">
                            <div className="bg-green-600 text-white px-4 py-2 font-semibold rounded-t-lg">
                                🚗 TRANSPORTASI
                            </div>
                            <div className="border border-t-0 border-gray-200 rounded-b-lg p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-600">Kendaraan</div>
                                        <div className="font-semibold">{booking.kendaraan.nama}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Tipe</div>
                                        <div className="font-semibold">{booking.kendaraan.tipe}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Kapasitas</div>
                                        <div className="font-semibold">{booking.kendaraan.kapasitas} orang</div>
                                    </div>
                                    {booking.sopir ? (
                                        <div>
                                            <div className="text-sm text-gray-600">Sopir</div>
                                            <div className="font-semibold">{booking.sopir.nama} (⭐ {booking.sopir.rating})</div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="text-sm text-gray-600">Sopir</div>
                                            <div className="font-semibold">Tanpa Sopir (Self Drive)</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Rincian Biaya */}
                        <div className="mb-6">
                            <div className="bg-indigo-600 text-white px-4 py-2 font-semibold rounded-t-lg">
                                💰 RINCIAN BIAYA
                            </div>
                            <div className="border border-t-0 border-gray-200 rounded-b-lg">
                                <div className="p-4 space-y-3">
                                    <div className="flex justify-between">
                                        <div>
                                            <div className="font-semibold">Tiket Wisata</div>
                                            <div className="text-sm text-gray-600">
                                                {booking.jumlah_orang} orang × Rp {Number(booking.tempat_wisata.harga_tiket).toLocaleString('id-ID')}
                                            </div>
                                        </div>
                                        <div className="font-semibold">
                                            Rp {Number(booking.tempat_wisata.harga_tiket * booking.jumlah_orang).toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                    <div className="flex justify-between pb-3 border-b">
                                        <div>
                                            <div className="font-semibold">Sewa Kendaraan</div>
                                            <div className="text-sm text-gray-600">
                                                {booking.jumlah_hari} hari × Rp {Number(booking.kendaraan.harga_per_hari).toLocaleString('id-ID')}
                                            </div>
                                        </div>
                                        <div className="font-semibold">
                                            Rp {Number(booking.kendaraan.harga_per_hari * booking.jumlah_hari).toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                    <div className="flex justify-between bg-gray-50 p-3 rounded-lg">
                                        <div className="text-lg font-bold">TOTAL PEMBAYARAN</div>
                                        <div className="text-2xl font-bold text-blue-600">
                                            Rp {Number(booking.total_harga).toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="text-center py-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                            <div className="text-sm text-gray-600">Status Booking</div>
                            <div className="font-bold text-lg text-yellow-600 uppercase">{booking.status}</div>
                        </div>

                        {/* Footer */}
                        <div className="text-center mt-6 pt-6 border-t border-gray-200">
                            <p className="font-semibold text-gray-900 mb-2">✨ Terima kasih telah memesan!</p>
                            <p className="text-sm text-gray-600">Selamat menikmati liburan Anda! 🙏</p>
                            <p className="text-sm text-gray-600 mt-2">📞 Hubungi kami: 0812-3456-7890</p>
                            <p className="text-xs text-gray-400 mt-2">www.wisataindonesia.com</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 justify-center print:hidden">
                        <button
                            onClick={handleDownloadPDF}
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download PDF
                        </button>

                        <button
                            onClick={handlePrint}
                            className="px-8 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all shadow-lg flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print
                        </button>

                        <a
                            href="/"
                            className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Kembali ke Beranda
                        </a>
                    </div>
                </div>
            </div>

            {/* CSS untuk Print dan Animation */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .bg-white, .bg-white * {
                        visibility: visible;
                    }
                    .bg-white {
                        position: absolute;
                        left: 0;
                        top: 0;
                        box-shadow: none !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                }
            `}</style>
        </>
    );
}
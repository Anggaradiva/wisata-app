import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import AIChat from '@/Components/AIChat';

export default function BookingIndex({ tempatWisata, kendaraan, sopir }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        nama_pemesan: '',
        no_hp: '',
        email: '',
        tempat_wisata_id: '',
        kendaraan_id: '',
        sopir_id: '',
        tanggal_berangkat: '',
        tanggal_kembali: '',
        jumlah_orang: 1,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedWisata, setSelectedWisata] = useState(null);
    const [selectedKendaraan, setSelectedKendaraan] = useState(null);
    const [selectedSopir, setSelectedSopir] = useState(null);
    const [estimasiHarga, setEstimasiHarga] = useState(0);
    const [searchWisata, setSearchWisata] = useState('');
    const [searchKendaraan, setSearchKendaraan] = useState('');

    // Filter data
    const filteredWisata = tempatWisata.filter(w => 
        w.nama.toLowerCase().includes(searchWisata.toLowerCase()) ||
        w.lokasi.toLowerCase().includes(searchWisata.toLowerCase())
    );

    const filteredKendaraan = kendaraan.filter(k =>
        k.nama.toLowerCase().includes(searchKendaraan.toLowerCase()) ||
        k.tipe.toLowerCase().includes(searchKendaraan.toLowerCase())
    );

    // Hitung estimasi harga
    useEffect(() => {
        if (selectedWisata && selectedKendaraan && formData.tanggal_berangkat && formData.tanggal_kembali) {
            const start = new Date(formData.tanggal_berangkat);
            const end = new Date(formData.tanggal_kembali);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            
            const hargaTiket = selectedWisata.harga_tiket * formData.jumlah_orang;
            const hargaKendaraan = selectedKendaraan.harga_per_hari * days;
            setEstimasiHarga(hargaTiket + hargaKendaraan);
        }
    }, [selectedWisata, selectedKendaraan, formData.tanggal_berangkat, formData.tanggal_kembali, formData.jumlah_orang]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'tempat_wisata_id') {
            const wisata = tempatWisata.find(w => w.id == value);
            setSelectedWisata(wisata);
        }
        if (name === 'kendaraan_id') {
            const kend = kendaraan.find(k => k.id == value);
            setSelectedKendaraan(kend);
        }
        if (name === 'sopir_id') {
            const sop = sopir.find(s => s.id == value);
            setSelectedSopir(sop);
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            console.log('📤 Sending booking data...');
            const response = await axios.post('/booking', formData);
            
            console.log('✅ Booking response:', response.data);
            
            if (response.data.success) {
                const bookingId = response.data.data.booking.id;
                const redirectUrl = response.data.data.redirect_url;
                
                console.log('✅ Booking berhasil! Redirecting to success page...');
                
                window.location.href = redirectUrl;
            }
        } catch (error) {
            console.error('❌ Booking Error:', error);
            console.error('Error details:', error.response?.data);
            
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                console.error('Validation errors:', error.response.data.errors);
            } else {
                const errorMsg = error.response?.data?.message || 'Terjadi kesalahan saat membuat booking';
                alert('❌ ERROR:\n\n' + errorMsg + '\n\nCheck console (F12) untuk detail.');
            }
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (currentStep === 1 && !formData.tempat_wisata_id) {
            alert('Pilih destinasi wisata terlebih dahulu');
            return;
        }
        if (currentStep === 2 && !formData.kendaraan_id) {
            alert('Pilih kendaraan terlebih dahulu');
            return;
        }
        if (currentStep === 3 && (!formData.tanggal_berangkat || !formData.tanggal_kembali)) {
            alert('Tentukan tanggal perjalanan terlebih dahulu');
            return;
        }
        setCurrentStep(prev => Math.min(prev + 1, 4));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    return (
        <>
            <Head title="Booking Wisata Indonesia" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                {/* Header */}
                <div className="bg-white shadow-sm border-b sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Wisata Indonesia</h1>
                                    <p className="text-xs text-gray-500">Eksplorasi Keindahan Nusantara</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Butuh Bantuan?</p>
                                <p className="text-sm font-semibold text-blue-600">0812-3456-7890</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Stepper */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            {[
                                { num: 1, label: 'Destinasi', icon: '🏝️' },
                                { num: 2, label: 'Kendaraan', icon: '🚗' },
                                { num: 3, label: 'Jadwal', icon: '📅' },
                                { num: 4, label: 'Konfirmasi', icon: '✅' }
                            ].map((step, index) => (
                                <div key={step.num} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all ${
                                            currentStep >= step.num 
                                                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg scale-110' 
                                                : 'bg-gray-200 text-gray-500'
                                        }`}>
                                            {currentStep > step.num ? '✓' : step.icon}
                                        </div>
                                        <span className={`mt-2 text-xs font-medium ${
                                            currentStep >= step.num ? 'text-blue-600' : 'text-gray-500'
                                        }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                    {index < 3 && (
                                        <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                                            currentStep > step.num ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-200'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form onSubmit={handleSubmit}>
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Left Content */}
                            <div className="lg:col-span-2 space-y-6">
                                
                                {/* Step 1: Pilih Destinasi */}
                                {currentStep === 1 && (
                                    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
                                        <div className="mb-6">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">🏝️ Pilih Destinasi Wisata</h2>
                                            <p className="text-gray-600">Temukan destinasi impian Anda</p>
                                        </div>

                                        {/* Search */}
                                        <div className="mb-6">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Cari destinasi atau lokasi..."
                                                    value={searchWisata}
                                                    onChange={(e) => setSearchWisata(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Destinasi Cards */}
                                        <div className="grid md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                                            {filteredWisata.map((wisata) => (
                                                <div
                                                    key={wisata.id}
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, tempat_wisata_id: wisata.id }));
                                                        setSelectedWisata(wisata);
                                                    }}
                                                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${
                                                        formData.tempat_wisata_id == wisata.id
                                                            ? 'border-blue-600 bg-blue-50 shadow-md'
                                                            : 'border-gray-200 hover:border-blue-300'
                                                    }`}
                                                >
                                                    {formData.tempat_wisata_id == wisata.id && (
                                                        <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div className="flex items-start space-x-3">
                                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                                                            🏝️
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-gray-900 truncate">{wisata.nama}</h3>
                                                            <p className="text-xs text-gray-500 flex items-center mt-1">
                                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                                </svg>
                                                                {wisata.lokasi}
                                                            </p>
                                                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{wisata.deskripsi}</p>
                                                            <p className="mt-3 text-lg font-bold text-blue-600">
                                                                Rp {Number(wisata.harga_tiket).toLocaleString('id-ID')}
                                                                <span className="text-xs text-gray-500 font-normal">/orang</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Pilih Kendaraan */}
                                {currentStep === 2 && (
                                    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
                                        <div className="mb-6">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">🚗 Pilih Kendaraan</h2>
                                            <p className="text-gray-600">Pilih transportasi yang sesuai</p>
                                        </div>

                                        {/* Search */}
                                        <div className="mb-6">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Cari kendaraan..."
                                                    value={searchKendaraan}
                                                    onChange={(e) => setSearchKendaraan(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Kendaraan Cards */}
                                        <div className="grid md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                                            {filteredKendaraan.map((kend) => (
                                                <div
                                                    key={kend.id}
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, kendaraan_id: kend.id }));
                                                        setSelectedKendaraan(kend);
                                                    }}
                                                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${
                                                        formData.kendaraan_id == kend.id
                                                            ? 'border-green-600 bg-green-50 shadow-md'
                                                            : 'border-gray-200 hover:border-green-300'
                                                    }`}
                                                >
                                                    {formData.kendaraan_id == kend.id && (
                                                        <div className="absolute top-3 right-3 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div className="flex items-start space-x-3">
                                                        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                                                            {kend.tipe === 'Motor' ? '🏍️' : kend.tipe === 'Bus' ? '🚌' : '🚗'}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-gray-900">{kend.nama}</h3>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                                    {kend.tipe}
                                                                </span>
                                                            </p>
                                                            <div className="flex items-center mt-2 text-sm text-gray-600">
                                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                                </svg>
                                                                Kapasitas {kend.kapasitas} orang
                                                            </div>
                                                            <p className="mt-3 text-lg font-bold text-green-600">
                                                                Rp {Number(kend.harga_per_hari).toLocaleString('id-ID')}
                                                                <span className="text-xs text-gray-500 font-normal">/hari</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Sopir Section */}
                                        <div className="mt-6 pt-6 border-t">
                                            <h3 className="font-semibold text-gray-900 mb-4">👨‍✈️ Pilih Sopir (Opsional)</h3>
                                            <select
                                                name="sopir_id"
                                                value={formData.sopir_id}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            >
                                                <option value="">Tanpa Sopir (Self Drive)</option>
                                                {sopir.map(sop => (
                                                    <option key={sop.id} value={sop.id}>
                                                        {sop.nama} - ⭐ {sop.rating} - {sop.no_hp}
                                                    </option>
                                                ))}
                                            </select>
                                            {selectedSopir && (
                                                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                                    <p className="text-sm text-gray-700">
                                                        <span className="font-semibold">Pengalaman:</span> {selectedSopir.pengalaman}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Jadwal & Detail */}
                                {currentStep === 3 && (
                                    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
                                        <div className="mb-6">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">📅 Tentukan Jadwal</h2>
                                            <p className="text-gray-600">Kapan Anda ingin berangkat?</p>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Tanggal */}
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        📅 Tanggal Berangkat
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="tanggal_berangkat"
                                                        value={formData.tanggal_berangkat}
                                                        onChange={handleChange}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        required
                                                    />
                                                    {errors.tanggal_berangkat && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.tanggal_berangkat[0]}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        📅 Tanggal Kembali
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="tanggal_kembali"
                                                        value={formData.tanggal_kembali}
                                                        onChange={handleChange}
                                                        min={formData.tanggal_berangkat || new Date().toISOString().split('T')[0]}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        required
                                                    />
                                                    {errors.tanggal_kembali && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.tanggal_kembali[0]}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Jumlah Orang */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    👥 Jumlah Orang
                                                </label>
                                                <input
                                                    type="number"
                                                    name="jumlah_orang"
                                                    value={formData.jumlah_orang}
                                                    onChange={handleChange}
                                                    min="1"
                                                    max={selectedKendaraan?.kapasitas || 100}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                                {selectedKendaraan && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Maksimal {selectedKendaraan.kapasitas} orang untuk kendaraan yang dipilih
                                                    </p>
                                                )}
                                                {errors.jumlah_orang && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.jumlah_orang[0]}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Konfirmasi */}
                                {currentStep === 4 && (
                                    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
                                        <div className="mb-6">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">✅ Konfirmasi Booking</h2>
                                            <p className="text-gray-600">Lengkapi data diri Anda</p>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Data Pemesan */}
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        👤 Nama Lengkap *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="nama_pemesan"
                                                        value={formData.nama_pemesan}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        required
                                                    />
                                                    {errors.nama_pemesan && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.nama_pemesan[0]}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        📱 No. WhatsApp *
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="no_hp"
                                                        value={formData.no_hp}
                                                        onChange={handleChange}
                                                        placeholder="08xxxxxxxxxx"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        required
                                                    />
                                                    {errors.no_hp && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.no_hp[0]}</p>
                                                    )}
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        ✉️ Email (Opsional)
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>

                                            {/* Ringkasan Booking */}
                                            <div className="border-t pt-6">
                                                <h3 className="font-semibold text-gray-900 mb-4">📋 Ringkasan Booking</h3>
                                                <div className="space-y-3">
                                                    {selectedWisata && (
                                                        <div className="flex justify-between items-start p-3 bg-blue-50 rounded-lg">
                                                            <div>
                                                                <p className="text-sm text-gray-600">Destinasi</p>
                                                                <p className="font-semibold text-gray-900">{selectedWisata.nama}</p>
                                                                <p className="text-xs text-gray-500">{selectedWisata.lokasi}</p>
                                                            </div>
                                                            <p className="text-sm font-semibold text-blue-600">
                                                                Rp {Number(selectedWisata.harga_tiket * formData.jumlah_orang).toLocaleString('id-ID')}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {selectedKendaraan && (
                                                        <div className="flex justify-between items-start p-3 bg-green-50 rounded-lg">
                                                            <div>
                                                                <p className="text-sm text-gray-600">Kendaraan</p>
                                                                <p className="font-semibold text-gray-900">{selectedKendaraan.nama}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {formData.tanggal_berangkat && formData.tanggal_kembali && 
                                                                        `${Math.ceil((new Date(formData.tanggal_kembali) - new Date(formData.tanggal_berangkat)) / (1000 * 60 * 60 * 24)) + 1} hari`
                                                                    }
                                                                </p>
                                                            </div>
                                                            <p className="text-sm font-semibold text-green-600">
                                                                {formData.tanggal_berangkat && formData.tanggal_kembali &&
                                                                    `Rp ${Number(selectedKendaraan.harga_per_hari * (Math.ceil((new Date(formData.tanggal_kembali) - new Date(formData.tanggal_berangkat)) / (1000 * 60 * 60 * 24)) + 1)).toLocaleString('id-ID')}`
                                                                }
                                                            </p>
                                                        </div>
                                                    )}

                                                    {selectedSopir && (
                                                        <div className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                                                            <div>
                                                                <p className="text-sm text-gray-600">Sopir</p>
                                                                <p className="font-semibold text-gray-900">{selectedSopir.nama}</p>
                                                                <p className="text-xs text-gray-500">⭐ {selectedSopir.rating}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                                                        <div>
                                                            <p className="text-sm text-gray-600">Jadwal</p>
                                                            <p className="font-semibold text-gray-900">
                                                                {formData.tanggal_berangkat && new Date(formData.tanggal_berangkat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                                {' - '}
                                                                {formData.tanggal_kembali && new Date(formData.tanggal_kembali).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                            </p>
                                                            <p className="text-xs text-gray-500">👥 {formData.jumlah_orang} orang</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between items-center mt-6">
                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-all"
                                        >
                                            ← Kembali
                                        </button>
                                    )}
                                    
                                    {currentStep < 4 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="ml-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                                        >
                                            Lanjut →
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="ml-auto px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                                        >
                                            {loading ? '⏳ Memproses...' : '✅ Konfirmasi Booking'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Right Sidebar - Price Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">💰 Ringkasan Harga</h3>
                                    
                                    {estimasiHarga > 0 ? (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Tiket Wisata</span>
                                                    <span className="font-medium">Rp {(selectedWisata.harga_tiket * formData.jumlah_orang).toLocaleString('id-ID')}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Sewa Kendaraan</span>
                                                    <span className="font-medium">
                                                        Rp {(selectedKendaraan.harga_per_hari * ((new Date(formData.tanggal_kembali) - new Date(formData.tanggal_berangkat)) / (1000 * 60 * 60 * 24) + 1)).toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="border-t pt-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                                    <span className="text-2xl font-bold text-blue-600">
                                                        Rp {estimasiHarga.toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                                <div className="flex items-start space-x-2">
                                                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                    </svg>
                                                    <div>
                                                        <p className="text-sm font-semibold text-blue-900">Catatan</p>
                                                        <p className="text-xs text-blue-700 mt-1">
                                                            Harga sudah termasuk tiket masuk dan sewa kendaraan. Biaya tambahan mungkin berlaku untuk aktivitas tertentu.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Pilih destinasi dan kendaraan untuk melihat estimasi harga
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="bg-white border-t mt-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="text-center text-sm text-gray-500">
                            <p>© 2025 Wisata Indonesia. Semua hak dilindungi.</p>
                            <p className="mt-1">Booking aman dan terpercaya dengan nota otomatis ke WhatsApp</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Chat Component */}
            <AIChat />

            {/* CSS Animation */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
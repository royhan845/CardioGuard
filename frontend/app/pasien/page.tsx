'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function PasienPage() {
  const [nama, setNama] = useState('');
  const [keluhan, setKeluhan] = useState('');
  const [hasil, setHasil] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/nlp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nama_pasien: nama,
          keluhan_teks: keluhan 
        })
      });
      const data = await res.json();
      setHasil(data);
    } catch (error) {
      alert("Gagal memproses AI. Pastikan server Python aktif.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200">
        <Link href="/" className="flex items-center text-sm text-slate-500 hover:text-slate-800 font-medium mb-8 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Kembali ke Utama
        </Link>
        <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Skrining Mandiri Pasien</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">Masukkan data diri dan jelaskan keluhan pada area dada atau pernapasan menggunakan bahasa sehari-hari.</p>

        {!hasil ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
              <input 
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none text-slate-700 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Keluhan</label>
              <textarea 
                rows={4} 
                value={keluhan}
                onChange={(e) => setKeluhan(e.target.value)}
                placeholder="Contoh: Akhir-akhir ini saya gampang capek, dada sering terasa tertekan apalagi kalau habis naik tangga..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none text-slate-700 resize-none transition-all"
                required
              />
            </div>
            
            <button type="submit" disabled={loading} className="w-full flex justify-center items-center bg-slate-900 text-white font-semibold py-4 rounded-2xl hover:bg-slate-800 transition-colors disabled:opacity-70 mt-4">
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : null}
              {loading ? 'Menyimpan ke Database...' : 'Kirim & Analisis Keluhan'}
            </button>
          </form>
        ) : (
          <div className="animate-in fade-in zoom-in duration-300">
            {/* Kartu Tiket ID */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl text-center mb-8 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <p className="text-slate-300 text-sm font-medium uppercase tracking-widest mb-2">Kode Skrining Anda</p>
              <h1 className="text-5xl font-black tracking-tight mb-4">{hasil.ticket_code}</h1>
              <p className="text-slate-400 text-sm">Simpan atau screenshot kode ini. Berikan kepada dokter Anda untuk melanjutkan proses rekam medis.</p>
            </div>

            <h3 className="font-semibold text-slate-800 text-lg mb-4 border-b border-slate-100 pb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              Kesimpulan Triase AI
            </h3>

            {hasil.tingkat_urgensi === "URGENSI TINGGI" || hasil.tingkat_urgensi === "URGENSI MENENGAH" ? (
              <div className={`${hasil.tingkat_urgensi === "URGENSI TINGGI" ? "bg-red-50 border-red-100" : "bg-yellow-50 border-yellow-100"} p-6 rounded-2xl mb-6`}>
                <div className="flex items-start mb-4">
                  <div className={`flex-shrink-0 w-10 h-10 ${hasil.tingkat_urgensi === "URGENSI TINGGI" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"} rounded-full flex items-center justify-center mr-4`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <div>
                    <h4 className={`text-lg font-bold ${hasil.tingkat_urgensi === "URGENSI TINGGI" ? "text-red-800" : "text-yellow-800"} mb-1`}>Indikasi Gejala Terdeteksi</h4>
                    <p className={`text-sm ${hasil.tingkat_urgensi === "URGENSI TINGGI" ? "text-red-600" : "text-yellow-700"} leading-relaxed`}>
                      Sistem mendeteksi adanya keluhan spesifik terkait kardiovaskular: <strong className="uppercase">{hasil.gejala_terdeteksi.join(', ')}</strong>.
                    </p>
                  </div>
                </div>
                <div className={`bg-white border ${hasil.tingkat_urgensi === "URGENSI TINGGI" ? "border-red-100 text-red-700" : "border-yellow-100 text-yellow-800"} p-4 rounded-xl text-sm font-medium shadow-sm`}>
                  Rekomendasi: Segera jadwalkan pemeriksaan lab (13 parameter klinis) dan temui Dokter.
                </div>
              </div>
            ) : (
              <div className="bg-teal-50 border border-teal-100 p-6 rounded-2xl mb-6">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-teal-900 mb-1">Keluhan Kritis Tidak Ditemukan</h4>
                    <p className="text-sm text-teal-700 leading-relaxed">
                      Berdasarkan deskripsi Anda, sistem tidak mendeteksi kata kunci gejala kardiovaskular akut.
                    </p>
                  </div>
                </div>
                <div className="bg-white border border-teal-100 text-teal-800 p-4 rounded-xl text-sm font-medium shadow-sm">
                  Rekomendasi: Tetap pertahankan pola hidup sehat. Berikan kode skrining di atas kepada dokter untuk evaluasi lebih lanjut.
                </div>
              </div>
            )}

            <button 
              onClick={() => window.location.reload()} 
              className="w-full mt-2 bg-slate-100 text-slate-600 font-semibold py-4 rounded-2xl hover:bg-slate-200 transition-colors"
            >
              Buat Skrining Baru
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
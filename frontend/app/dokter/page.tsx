'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function DokterPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    model_choice: 'rf',
    age: 45, sex: 1, cp: 0, trestbps: 120, chol: 200, 
    fbs: 0, restecg: 0, thalach: 150, exang: 0, 
    oldpeak: 1.0, slope: 0, ca: 0, thal: 2
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'model_choice' ? value : Number(value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      alert("Gagal memproses data. Pastikan server Python aktif.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Helper untuk menerjemahkan angka form menjadi teks medis saat dicetak
  const mapData = {
    sex: formData.sex === 1 ? 'Laki-laki' : 'Perempuan',
    cp: ['Tipikal Angina', 'Atipikal Angina', 'Non-anginal', 'Asimtomatik'][formData.cp],
    fbs: formData.fbs === 1 ? 'Positif (> 120 mg/dl)' : 'Negatif (< 120 mg/dl)',
    restecg: ['Normal', 'ST-T Abnormality', 'Hipertrofi LV'][formData.restecg],
    exang: formData.exang === 1 ? 'Ya (Positif)' : 'Tidak (Negatif)',
    slope: ['Upsloping', 'Flat', 'Downsloping'][formData.slope],
    thal: ['Null', 'Normal', 'Fixed Defect', 'Reversable'][formData.thal],
    model: formData.model_choice === 'rf' ? 'Random Forest' : formData.model_choice === 'svm' ? 'Support Vector Machine' : formData.model_choice === 'lr' ? 'Logistic Regression' : 'K-Nearest Neighbors'
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6 font-sans text-slate-800 print:bg-white print:py-0 print:px-0">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigasi & Header */}
        <div className="mb-10 print:hidden">
          <Link href="/" className="flex items-center text-sm text-slate-500 hover:text-teal-600 font-medium mb-6 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Kembali ke Portal Utama
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Klinis Dokter</h1>
              <p className="text-slate-500 mt-1">Evaluasi 13 Parameter Rekam Medis (Cleveland Dataset)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block">
          
          {/* Form Panel (Sembunyi saat dicetak) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200 print:hidden">
            <h2 className="text-lg font-bold border-b border-slate-100 pb-4 mb-6 text-slate-800">Input Data Tabular</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                
                {/* Baris 1: Numerik */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Usia</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm" required />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tensi (mmHg)</label>
                  <input type="number" name="trestbps" value={formData.trestbps} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm" required />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Kolesterol (mg/dl)</label>
                  <input type="number" name="chol" value={formData.chol} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm" required />
                </div>

                {/* Baris 2 */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Detak Jantung Maks</label>
                  <input type="number" name="thalach" value={formData.thalach} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm" required />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Depresi ST</label>
                  <input type="number" step="0.1" name="oldpeak" value={formData.oldpeak} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm" required />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Jenis Kelamin</label>
                  <select name="sex" value={formData.sex} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm">
                    <option value={1}>Laki-laki</option>
                    <option value={0}>Perempuan</option>
                  </select>
                </div>

                {/* Baris 3 */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nyeri Dada (CP)</label>
                  <select name="cp" value={formData.cp} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm">
                    <option value={0}>Tipikal Angina</option>
                    <option value={1}>Atipikal Angina</option>
                    <option value={2}>Non-anginal</option>
                    <option value={3}>Asimtomatik</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Gula Darah {">"} 120</label>
                  <select name="fbs" value={formData.fbs} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm">
                    <option value={0}>Negatif</option>
                    <option value={1}>Positif</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Hasil EKG</label>
                  <select name="restecg" value={formData.restecg} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm">
                    <option value={0}>Normal</option>
                    <option value={1}>ST-T Abnorm</option>
                    <option value={2}>Hipertrofi LV</option>
                  </select>
                </div>

                {/* Baris 4 */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Angina Olahraga</label>
                  <select name="exang" value={formData.exang} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm">
                    <option value={0}>Tidak</option>
                    <option value={1}>Ya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Kemiringan ST</label>
                  <select name="slope" value={formData.slope} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm">
                    <option value={0}>Upsloping</option>
                    <option value={1}>Flat</option>
                    <option value={2}>Downsloping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pembuluh (CA)</label>
                  <input type="number" min="0" max="4" name="ca" value={formData.ca} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm" required />
                </div>

                {/* Baris 5 */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Thalassemia</label>
                  <select name="thal" value={formData.thal} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm">
                    <option value={0}>Null</option>
                    <option value={1}>Normal</option>
                    <option value={2}>Fixed Defect</option>
                    <option value={3}>Reversable</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2">Algoritma AI</label>
                  <select name="model_choice" value={formData.model_choice} onChange={handleChange} className="w-full p-3 bg-slate-100 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-semibold text-slate-800 transition-all text-sm">
                    <option value="rf">Random Forest Classifier</option>
                    <option value="svm">Support Vector Machine (SVM)</option>
                    <option value="lr">Logistic Regression</option>
                    <option value="knn">K-Nearest Neighbors</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full flex justify-center items-center bg-teal-700 hover:bg-teal-800 text-white font-semibold py-4 rounded-xl transition-all shadow-sm mt-4 disabled:opacity-70">
                {loading ? 'Mengkalkulasi...' : 'Eksekusi Kalkulasi Risiko'}
              </button>
            </form>
          </div>

          {/* Result Panel & Print Layout */}
          <div className="lg:col-span-1 print:w-full print:block">
            {result ? (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 print:shadow-none print:border-none print:p-0">
                
                {/* Header Print */}
                <div className="hidden print:block mb-8 text-center border-b-2 border-slate-800 pb-4">
                  <h1 className="text-2xl font-bold text-slate-900">Laporan Evaluasi Medis (AI)</h1>
                  <p className="text-slate-500 text-sm mt-1">Sistem Pendukung Keputusan CardioGuard - Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
                </div>

                {/* TABEL DATA INPUT (HANYA MUNCUL SAAT DI-PRINT) */}
                <div className="hidden print:block mb-8">
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-300 pb-2 mb-4">A. Parameter Klinis Pasien</h2>
                  <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm text-slate-700">
                    <div className="flex justify-between border-b border-slate-100 pb-1"><span>Usia:</span> <strong>{formData.age} Tahun</strong></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1"><span>Jenis Kelamin:</span> <strong>{mapData.sex}</strong></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1"><span>Tensi Darah (RestBP):</span> <strong>{formData.trestbps} mmHg</strong></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1"><span>Kolesterol:</span> <strong>{formData.chol} mg/dl</strong></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1"><span>Detak Jantung (Thalach):</span> <strong>{formData.thalach} bpm</strong></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1"><span>Gula Darah (FBS):</span> <strong>{mapData.fbs}</strong></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1"><span>Nyeri Dada (CP):</span> <strong>{mapData.cp}</strong></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1"><span>Hasil EKG:</span> <strong>{mapData.restecg}</strong></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1"><span>Angina Olahraga:</span> <strong>{mapData.exang}</strong></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1"><span>Depresi ST (Oldpeak):</span> <strong>{formData.oldpeak}</strong></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1"><span>Kemiringan ST (Slope):</span> <strong>{mapData.slope}</strong></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1"><span>Pembuluh Darah (CA):</span> <strong>{formData.ca}</strong></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1"><span>Thalassemia:</span> <strong>{mapData.thal}</strong></div>
                    <div className="flex justify-between border-b border-slate-100 pb-1"><span>Model Komputasi:</span> <strong>{mapData.model}</strong></div>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-slate-800 mb-4 print:text-sm print:uppercase print:tracking-widest print:border-b print:border-slate-300 print:pb-2">B. Hasil Inferensi AI</h2>
                
                <div className={`p-8 rounded-2xl text-center mb-8 border ${result.prediction === 1 ? 'bg-red-50 border-red-100 print:border-red-500' : 'bg-teal-50 border-teal-100 print:border-teal-500'} print:p-6`}>
                  <p className={`text-[11px] font-bold uppercase tracking-widest ${result.prediction === 1 ? 'text-red-600' : 'text-teal-700'}`}>
                    {result.prediction === 1 ? 'Indikasi Positif' : 'Indikasi Negatif'}
                  </p>
                  <p className="text-5xl font-black mt-3 text-slate-900 tracking-tight print:text-4xl">
                    {(result.probability * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs font-medium text-slate-500 mt-3">Probabilitas Risiko Kardiovaskular</p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Rekomendasi Tindakan:</h3>
                  {result.prediction === 1 ? (
                    <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4 marker:text-red-400">
                      <li>Perlu evaluasi klinis lanjutan (Angiografi).</li>
                      <li>Sarankan modifikasi gaya hidup segera.</li>
                      {formData.chol > 200 && <li>Tinjau ulang regimen statin / penurun lipid.</li>}
                      {formData.trestbps > 130 && <li>Observasi hipertensi stadium awal.</li>}
                    </ul>
                  ) : (
                    <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4 marker:text-teal-400">
                      <li>Parameter berada dalam batas toleransi.</li>
                      <li>Lanjutkan pemeriksaan rutin tahunan.</li>
                    </ul>
                  )}
                </div>

                {/* Tombol Print */}
                <div className="mt-10 pt-6 border-t border-slate-100 print:hidden">
                  <button 
                    onClick={() => window.print()} 
                    className="w-full flex justify-center items-center bg-slate-900 hover:bg-slate-800 text-white font-medium py-4 rounded-xl transition-colors shadow-sm"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Cetak Dokumen PDF
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-200 h-full flex flex-col items-center justify-center text-slate-400 text-center print:hidden">
                <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                <p className="text-sm font-medium text-slate-500">Panel Hasil Analisis<br/><span className="text-xs font-normal mt-1 block">Menunggu kalkulasi model...</span></p>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
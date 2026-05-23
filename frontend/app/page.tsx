import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
      <div className="text-center mb-12 animate-fade-up">
        <span className="text-teal-600 font-bold tracking-widest text-xs uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Portal Sistem Pakar</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-4 tracking-tight">CardioGuard AI</h1>
        <p className="text-slate-500 mt-4 max-w-lg mx-auto">Silakan pilih portal masuk sesuai dengan peran Anda untuk melanjutkan proses skrining medis terpadu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
        {/* Card Pasien */}
        <Link href="/pasien" className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all text-center flex flex-col items-center cursor-pointer">
          <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-800 group-hover:text-white transition-all duration-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Portal Pasien</h2>
          <p className="text-slate-500 text-sm">Ceritakan keluhan fisik Anda untuk mendapatkan analisis awal dari sistem NLP.</p>
        </Link>

        {/* Card Dokter */}
        <Link href="/dokter" className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all text-center flex flex-col items-center cursor-pointer">
          <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Portal Dokter</h2>
          <p className="text-slate-500 text-sm">Input data rekam medis 13 parameter klinis untuk hasil prediksi Machine Learning.</p>
        </Link>
      </div>
    </main>
  );
}
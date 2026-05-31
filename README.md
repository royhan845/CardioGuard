# CardioGuard AI: Sistem Skrining Hibrida Penyakit Jantung

Sistem pendukung keputusan klinis (*Clinical Decision Support System*) berbasis *website* yang mengimplementasikan arsitektur **Hybrid Artificial Intelligence**. Sistem ini menggabungkan **Natural Language Processing (NLP)** untuk ekstraksi keluhan pasien dan **Machine Learning (Klasifikasi Tabular)** untuk prediksi risiko kardiovaskular.

Proyek ini dibangun sebagai purwarupa untuk tugas akhir program studi Informatika.

## Arsitektur Sistem (Role-Based)

Aplikasi ini dibagi menjadi 2 portal pengguna untuk mencegah bias data dan menjaga integritas rekam medis:

1. **Portal Pasien (Triase NLP):**
   - Pasien menginput keluhan menggunakan bahasa sehari-hari.
   - Sistem memproses teks menggunakan **Sastrawi Stemmer** untuk mendeteksi kata kunci urgensi medis (misal: nyeri dada, palpitasi).
   - Menghasilkan **ID Skrining (Tiket)** sebagai jembatan data.

2. **Portal Dokter (Klasifikasi ML):**
   - Dokter menarik data keluhan pasien menggunakan ID Skrining.
   - Dokter memasukkan 13 parameter klinis dari hasil lab (Dataset Cleveland).
   - Sistem mengeksekusi model Machine Learning (*Random Forest / SVM*) untuk mengeluarkan persentase probabilitas risiko.
   - Dilengkapi fitur ekspor/cetak laporan medis berbentuk PDF.

## Teknologi yang Digunakan

**Frontend:**
- [Next.js](https://nextjs.org/) (React Framework)
- [Tailwind CSS](https://tailwindcss.com/) (Styling & Print Layout)

**Backend & AI:**
- [Python Flask](https://flask.palletsprojects.com/) (REST API Server)
- [SQLAlchemy & SQLite](https://www.sqlalchemy.org/) (Database Manajemen Relasional)
- [Scikit-Learn](https://scikit-learn.org/) (Pemodelan Machine Learning)
- [Sastrawi](https://github.com/har07/PySastrawi) (NLP Bahasa Indonesia)

## Cara Menjalankan Aplikasi di Komputer Lokal

Pastikan Anda sudah menginstal **Node.js** dan **Python 3.x** di komputer Anda.

### 1. Menjalankan Backend (Python Flask)
Buka terminal, masuk ke folder backend, instal dependensi, lalu jalankan server:
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*Server API akan berjalan di `http://127.0.0.1:5000` dan otomatis membuat file database SQLite.*

### 2. Menjalankan Frontend (Next.js)
Buka terminal baru, masuk ke folder frontend, instal modul, lalu jalankan web:
```bash
cd frontend
npm install
npm run dev
```
*Buka browser dan akses `http://localhost:3000`.*

---
**Author:** 
1. Royhan Firdaus - 23SA11A163
2.
3.

**Institution:** Universitas Amikom Purwokerto  

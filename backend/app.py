from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
import joblib
import random
import string
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory

app = Flask(__name__)
CORS(app)

# Konfigurasi Database SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cardioguard.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# 1. DESAIN TABEL DATABASE (SKEMA)
class RekamMedis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ticket_code = db.Column(db.String(10), unique=True, nullable=False)
    nama_pasien = db.Column(db.String(100), nullable=True)
    
    # Data dari Pasien (Fase 1)
    keluhan_teks = db.Column(db.Text, nullable=True)
    gejala_nlp = db.Column(db.String(200), nullable=True)
    
    # Data dari Dokter (Fase 2)
    age = db.Column(db.Integer, nullable=True)
    sex = db.Column(db.Integer, nullable=True)
    cp = db.Column(db.Integer, nullable=True)
    trestbps = db.Column(db.Integer, nullable=True)
    chol = db.Column(db.Integer, nullable=True)
    fbs = db.Column(db.Integer, nullable=True)
    restecg = db.Column(db.Integer, nullable=True)
    thalach = db.Column(db.Integer, nullable=True)
    exang = db.Column(db.Integer, nullable=True)
    oldpeak = db.Column(db.Float, nullable=True)
    slope = db.Column(db.Integer, nullable=True)
    ca = db.Column(db.Integer, nullable=True)
    thal = db.Column(db.Integer, nullable=True)
    
    # Hasil Akhir
    prediction = db.Column(db.Integer, nullable=True)
    probability = db.Column(db.Float, nullable=True)
    status = db.Column(db.String(20), default="Menunggu") # Status: Menunggu / Selesai

# 2. INISIALISASI AI (ML & NLP)
try:
    models = {
        "svm": joblib.load('model/svm_model.pkl'),
        "rf": joblib.load('model/rf_model.pkl'),
        "lr": joblib.load('model/lr_model.pkl'),
        "knn": joblib.load('model/knn_model.pkl')
    }
    scaler = joblib.load('model/scaler.pkl')
except Exception as e:
    print(f"Error load model: {e}")

stemmer = StemmerFactory().create_stemmer()
stopword_remover = StopWordRemoverFactory().create_stop_word_remover()

def generate_ticket():
    return "CG-" + ''.join(random.choices(string.digits, k=4))

# 3. ENDPOINT API (JALUR KOMUNIKASI)

# A. PASIEN: Kirim Keluhan & Buat Tiket
@app.route('/api/nlp', methods=['POST'])
def analyze_nlp():
    data = request.json
    teks = data.get('keluhan_teks', '')
    nama = data.get('nama_pasien', 'Anonim')
    
    # Proses Sastrawi
    teks_bersih = stemmer.stem(stopword_remover.remove(teks.lower()))
    kamus_gejala = {
        "Nyeri Dada": ["nyeri", "sakit", "tekan"], 
        "Sesak Napas": ["sesak", "engap"],
        "Palpitasi": ["debar", "kencang"]
    }
    gejala_terdeteksi = [g for g, s in kamus_gejala.items() if any(x in teks_bersih for x in s)]
    gejala_string = ", ".join(gejala_terdeteksi) if gejala_terdeteksi else "Negatif"
    
    # Simpan ke Database
    new_ticket = generate_ticket()
    rekam_baru = RekamMedis(
        ticket_code=new_ticket,
        nama_pasien=nama,
        keluhan_teks=teks,
        gejala_nlp=gejala_string
    )
    db.session.add(rekam_baru)
    db.session.commit()
    
    return jsonify({
        "status": "success",
        "ticket_code": new_ticket,
        "gejala_terdeteksi": gejala_terdeteksi,
        "nlp_log": teks_bersih
    })

# B. DOKTER: Tarik Data Tiket Pasien
@app.route('/api/ticket/<ticket_code>', methods=['GET'])
def get_ticket(ticket_code):
    pasien = RekamMedis.query.filter_by(ticket_code=ticket_code).first()
    if not pasien:
        return jsonify({"status": "error", "message": "Tiket tidak ditemukan"}), 404
        
    return jsonify({
        "status": "success",
        "ticket_code": pasien.ticket_code,
        "nama_pasien": pasien.nama_pasien,
        "keluhan_teks": pasien.keluhan_teks,
        "gejala_nlp": pasien.gejala_nlp,
        "status_pemeriksaan": pasien.status
    })

# C. DOKTER: Proses ML & Update Tiket
@app.route('/api/predict', methods=['POST'])
def predict_ml():
    data = request.json
    ticket_code = data.get('ticket_code')
    
    if not ticket_code:
        return jsonify({"status": "error", "message": "Kode tiket wajib diisi!"}), 400
        
    pasien = RekamMedis.query.filter_by(ticket_code=ticket_code).first()
    if not pasien:
        return jsonify({"status": "error", "message": "Tiket tidak ditemukan"}), 404
        
    # Eksekusi ML
    model_aktif = models.get(data.get('model_choice', 'rf'))
    input_df = pd.DataFrame([{
        'age': data['age'], 'sex': data['sex'], 'cp': data['cp'], 
        'trestbps': data['trestbps'], 'chol': data['chol'], 'fbs': data['fbs'], 
        'restecg': data['restecg'], 'thalach': data['thalach'], 'exang': data['exang'], 
        'oldpeak': data['oldpeak'], 'slope': data['slope'], 'ca': data['ca'], 'thal': data['thal']
    }])
    
    kolom_numerik = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak']
    input_df[kolom_numerik] = scaler.transform(input_df[kolom_numerik])
    
    kolom_kategorik = ['cp', 'restecg', 'slope', 'ca', 'thal']
    input_df = pd.get_dummies(input_df, columns=kolom_kategorik)
    input_df = input_df.reindex(columns=model_aktif.feature_names_in_, fill_value=0)
    
    prediction = int(model_aktif.predict(input_df)[0])
    probability = float(model_aktif.predict_proba(input_df)[0][1])

    # Update Data ke Database
    pasien.age = data['age']
    pasien.sex = data['sex']
    pasien.cp = data['cp']
    pasien.trestbps = data['trestbps']
    pasien.chol = data['chol']
    pasien.fbs = data['fbs']
    pasien.restecg = data['restecg']
    pasien.thalach = data['thalach']
    pasien.exang = data['exang']
    pasien.oldpeak = data['oldpeak']
    pasien.slope = data['slope']
    pasien.ca = data['ca']
    pasien.thal = data['thal']
    pasien.prediction = prediction
    pasien.probability = probability
    pasien.status = "Selesai"
    
    db.session.commit()

    return jsonify({
        "status": "success",
        "prediction": prediction,
        "probability": probability
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    app.run(port=5000, debug=True)
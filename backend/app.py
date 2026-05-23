from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory

app = Flask(__name__)
CORS(app)

# Load Model & NLP
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

# Endpoint 1: Khusus Pasien (Hanya NLP Sastrawi)
@app.route('/api/nlp', methods=['POST'])
def analyze_nlp():
    data = request.json
    teks = data.get('keluhan_teks', '')
    
    teks_bersih = stemmer.stem(stopword_remover.remove(teks.lower()))
    kamus_gejala = {
        "Nyeri Dada": ["nyeri", "sakit", "tekan"], 
        "Sesak Napas": ["sesak", "engap"],
        "Palpitasi": ["debar", "kencang"]
    }
    gejala_terdeteksi = [g for g, s in kamus_gejala.items() if any(x in teks_bersih for x in s)]
    
    return jsonify({
        "status": "success",
        "nlp_log": teks_bersih,
        "gejala_terdeteksi": gejala_terdeteksi
    })

# Endpoint 2: Khusus Dokter (Machine Learning + 13 Parameter)
@app.route('/api/predict', methods=['POST'])
def predict_ml():
    data = request.json
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

    return jsonify({
        "status": "success",
        "prediction": prediction,
        "probability": probability
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
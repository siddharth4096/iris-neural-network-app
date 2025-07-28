from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

model = joblib.load('model.pkl')
scaler = joblib.load('scaler.pkl')
encoder = joblib.load('label_encoder.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = np.array(data['features']).reshape(1, -1)
    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)
    class_name = encoder.inverse_transform(prediction)[0]
    # return jsonify({'prediction': class_name})
      # Add prediction probabilities
    probs = model.predict_proba(features_scaled)[0]
    labels = encoder.inverse_transform(np.arange(len(probs)))

    return jsonify({
        'prediction': class_name,
        'probabilities': dict(zip(labels, probs.tolist()))
    })

if __name__ == '__main__':
    app.run(debug=True)

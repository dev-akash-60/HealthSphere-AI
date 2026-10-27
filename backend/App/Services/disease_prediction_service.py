import os
import joblib
import numpy as np


# =========================
# Model Paths
# =========================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "disease_prediction_model.pkl"
)

FEATURES_PATH = os.path.join(
    BASE_DIR,
    "models",
    "disease_features.pkl"
)


# =========================
# Load Model
# =========================

model = joblib.load(MODEL_PATH)

features = joblib.load(FEATURES_PATH)


# =========================
# Prediction Function
# =========================

def predict_disease(symptoms: list[str]):

    # Create 131-feature vector
    input_data = np.zeros(
        len(features),
        dtype=int
    )

    # Activate selected symptoms
    for symptom in symptoms:

        if symptom in features:

            index = features.index(symptom)

            input_data[index] = 1

    # Predict disease
    prediction = model.predict(
        [input_data]
    )[0]

    # Get probabilities
    probabilities = model.predict_proba(
        [input_data]
    )[0]

    # Get top 3 predictions
    top_indices = np.argsort(
        probabilities
    )[::-1][:3]

    top_predictions = []

    for index in top_indices:

        top_predictions.append({
            "disease": model.classes_[index],
            "probability": round(
                float(probabilities[index]) * 100,
                2
            )
        })

    return {
        "disease": prediction,
        "top_predictions": top_predictions
    }
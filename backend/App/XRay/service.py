import os
import gc
import threading
import numpy as np
from PIL import Image
import tensorflow as tf
from tensorflow.keras.models import load_model


# =========================================================
# MODEL PATHS
# =========================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models")

XRAY_VALIDATOR_PATH = os.path.join(
    MODEL_DIR, "xray_validator_v2.keras"
)

FRACTURE_MODEL_PATH = os.path.join(
    MODEL_DIR, "fracture_detection_model.keras"
)

# Avoid simultaneous requests loading multiple large models.
XRAY_LOCK = threading.Lock()


# =========================================================
# IMAGE PREPROCESSING
# =========================================================

def preprocess_image(image: Image.Image):
    image = image.convert("RGB")
    image = image.resize((224, 224))

    image_array = np.asarray(image, dtype=np.float32)
    image_array = np.expand_dims(image_array, axis=0)

    return image_array


# =========================================================
# SINGLE-MODEL INFERENCE
# =========================================================

def predict_and_release(model_path, image_array):
    """
    Load one model, perform inference, then release references.
    Models are intentionally not cached because RAM is limited.
    """

    model = None

    try:
        model = load_model(model_path, compile=False)

        # Direct model invocation avoids some predict() overhead.
        output = model(image_array, training=False)
        result = np.asarray(output)[0].copy()

        return result

    finally:
        if model is not None:
            del model

        tf.keras.backend.clear_session()
        gc.collect()


# =========================================================
# X-RAY VALIDATION
# =========================================================

def check_xray(image: Image.Image):
    image_array = preprocess_image(image)

    output = predict_and_release(
        XRAY_VALIDATOR_PATH,
        image_array
    )

    probability = float(output.reshape(-1)[0])
    is_xray = probability >= 0.5

    return {
        "is_xray": is_xray,
        "xray_probability": probability
    }


# =========================================================
# FRACTURE PREDICTION
# =========================================================

def predict_fracture(image: Image.Image):
    image_array = preprocess_image(image)

    output = predict_and_release(
        FRACTURE_MODEL_PATH,
        image_array
    )

    model_output = float(output.reshape(-1)[0])

    print("FRACTURE MODEL RAW OUTPUT:", model_output)

    # Preserve your existing model interpretation.
    # Verify this mapping against your training labels.
    fracture_probability = 1.0 - model_output

    prediction = (
        "fractured"
        if fracture_probability >= 0.5
        else "not fractured"
    )

    return {
        "prediction": prediction,
        "fracture_probability": fracture_probability
    }


# =========================================================
# COMPLETE X-RAY ANALYSIS
# =========================================================

def analyze_xray(image: Image.Image):
    with XRAY_LOCK:
        image_array = preprocess_image(image)

        validation_output = predict_and_release(
            XRAY_VALIDATOR_PATH,
            image_array
        )

        xray_probability = float(
            validation_output.reshape(-1)[0]
        )

        is_xray = xray_probability >= 0.5

        if not is_xray:
            return {
                "success": False,
                "is_xray": False,
                "message": (
                    "The uploaded image does not appear "
                    "to be an X-ray image."
                ),
                "xray_probability": xray_probability
            }

        fracture_output = predict_and_release(
            FRACTURE_MODEL_PATH,
            image_array
        )

        model_output = float(
            fracture_output.reshape(-1)[0]
        )

        fracture_probability = 1.0 - model_output

        prediction = (
            "fractured"
            if fracture_probability >= 0.5
            else "not fractured"
        )

        return {
            "success": True,
            "is_xray": True,
            "message": "X-ray image analyzed successfully.",
            "xray_probability": xray_probability,
            "prediction": prediction,
            "fracture_probability": fracture_probability
        }
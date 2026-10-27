import os
import numpy as np
from PIL import Image

from tensorflow.keras.models import load_model


# =========================================================
# MODEL PATHS
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models"
)


XRAY_VALIDATOR_PATH = os.path.join(
    MODEL_DIR,
    "xray_validator_v2.keras"
)


FRACTURE_MODEL_PATH = os.path.join(
    MODEL_DIR,
    "fracture_detection_model.keras"
)


# =========================================================
# LOAD MODELS
# =========================================================

print(
    "Loading X-ray validator..."
)

xray_validator = load_model(
    XRAY_VALIDATOR_PATH
)


print(
    "Loading fracture detection model..."
)

fracture_model = load_model(
    FRACTURE_MODEL_PATH
)


print(
    "X-ray models loaded successfully."
)


# =========================================================
# IMAGE PREPROCESSING
# =========================================================

def preprocess_image(
    image: Image.Image
):

    image = image.convert(
        "RGB"
    )

    image = image.resize(
        (224, 224)
    )

    image_array = np.array(
        image,
        dtype=np.float32
    )

    image_array = np.expand_dims(
        image_array,
        axis=0
    )

    return image_array


# =========================================================
# X-RAY VALIDATION
# =========================================================

def check_xray(
    image: Image.Image
):

    image_array = preprocess_image(
        image
    )

    probability = float(
        xray_validator.predict(
            image_array,
            verbose=0
        )[0][0]
    )


    is_xray = (
        probability >= 0.5
    )


    return {
        "is_xray": is_xray,
        "xray_probability": probability
    }


# =========================================================
# FRACTURE PREDICTION
# =========================================================

'''def predict_fracture(
    image: Image.Image
):

    image_array = preprocess_image(
        image
    )

    probability = float(
        fracture_model.predict(
            image_array,
            verbose=0
        )[0][0]
    )


    if probability >= 0.5:

        prediction = "fractured"

    else:

        prediction = "not fractured"


    return {
        "prediction": prediction,
        "fracture_probability": probability
    }'''
def predict_fracture(
    image: Image.Image
):

    image_array = preprocess_image(
        image
    )

    model_output = float(
        fracture_model.predict(
            image_array,
            verbose=0
        )[0][0]
    )

    print(
        "FRACTURE MODEL RAW OUTPUT:",
        model_output
    )


    # Model mapping:
    # 0 → fractured
    # 1 → not fractured

    fracture_probability = 1.0 - model_output


    if fracture_probability >= 0.5:

        prediction = "fractured"

    else:

        prediction = "not fractured"


    return {

        "prediction":
            prediction,

        "fracture_probability":
            fracture_probability
    }

# =========================================================
# COMPLETE X-RAY ANALYSIS
# =========================================================

def analyze_xray(
    image: Image.Image
):

    # ---------------------------------------------
    # STEP 1: CHECK WHETHER IMAGE IS AN X-RAY
    # ---------------------------------------------

    validation = check_xray(
        image
    )


    if not validation["is_xray"]:

        return {
            "success": False,

            "is_xray": False,

            "message":
                "The uploaded image does not appear to be an X-ray image.",

            "xray_probability":
                validation["xray_probability"]
        }


    # ---------------------------------------------
    # STEP 2: FRACTURE DETECTION
    # ---------------------------------------------

    fracture = predict_fracture(
        image
    )


    # ---------------------------------------------
    # FINAL RESPONSE
    # ---------------------------------------------

    return {

        "success": True,

        "is_xray": True,

        "message":
            "X-ray image analyzed successfully.",

        "xray_probability":
            validation["xray_probability"],

        "prediction":
            fracture["prediction"],

        "fracture_probability":
            fracture["fracture_probability"]
    }
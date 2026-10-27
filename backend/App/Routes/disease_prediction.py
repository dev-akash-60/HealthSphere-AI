from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from App.Services.disease_prediction_service import predict_disease


router = APIRouter(
    prefix="/disease",
    tags=["Disease Prediction"]
)


# =========================
# Request Model
# =========================

class PredictionRequest(BaseModel):

    symptoms: list[str]


# =========================
# Prediction Endpoint
# =========================

@router.post("/predict")
def predict(data: PredictionRequest):

    try:

        if not data.symptoms:

            raise HTTPException(
                status_code=400,
                detail="Please provide at least one symptom."
            )

        result = predict_disease(
            data.symptoms
        )

        return result

    except HTTPException:

        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException
)

from PIL import Image
import io

from App.XRay.service import analyze_xray


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/xray",
    tags=["X-Ray Analysis"]
)


# =========================================================
# X-RAY PREDICTION
# =========================================================

@router.post("/predict")
async def predict_xray(
    file: UploadFile = File(...)
):

    # =====================================================
    # CHECK FILE TYPE
    # =====================================================

    allowed_types = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ]

    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file."
        )


    # =====================================================
    # READ FILE
    # =====================================================

    image_bytes = await file.read()


    if not image_bytes:

        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty."
        )


    # =====================================================
    # CONVERT BYTES → PIL IMAGE
    # =====================================================

    try:

        image = Image.open(
            io.BytesIO(image_bytes)
        )

        image.load()

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Unable to read the uploaded image."
        )


    # =====================================================
    # ANALYZE IMAGE
    # =====================================================

    try:

        result = analyze_xray(
            image
        )

        return result

    except Exception as e:

        print(
            "X-Ray prediction error:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to analyze the X-ray image."
        )
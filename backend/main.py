from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from App.Chatbot.routes import router as chatbot_router
from App.Routes.disease_prediction import router as disease_router
from App.XRay.routes import router as xray_router


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="HealthSphere AI Backend",
    description="AI Powered Healthcare Assistant API",
    version="1.0.0"
)


# =========================================================
# CORS CONFIGURATION
# =========================================================

# =========================================================
# CORS CONFIGURATION
# =========================================================

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://healthsphere-ai-by8o.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# INCLUDE ROUTERS
# =========================================================

# Chatbot
app.include_router(
    chatbot_router
)


# Disease Prediction
app.include_router(
    disease_router
)


# X-Ray Analysis
app.include_router(
    xray_router
)


# =========================================================
# HOME ROUTE
# =========================================================

@app.get("/")
def home():

    return {
        "project": "HealthSphere AI",
        "status": "Backend Running Successfully"
    }


# =========================================================
# SERVER
# =========================================================

# Run using:
#
# uvicorn main:app --reload
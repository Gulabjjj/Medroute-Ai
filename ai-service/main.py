from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from api.chat_routes import router as chat_router
from api.report_routes import router as report_router
from api.emergency_routes import router as emergency_router

app = FastAPI()

# uploads/ and vector_stores/ are git-ignored, so they don't exist on a fresh
# deploy (e.g. Render). Create them at startup.
os.makedirs("uploads", exist_ok=True)
os.makedirs("vector_stores", exist_ok=True)

# In production, set FRONTEND_URL to your deployed client's origin
# (e.g. https://medroute.vercel.app) so the browser is allowed to call this API.
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(report_router)
app.include_router(emergency_router)

@app.get("/")
def home():
    return {"message": "MedRoute AI Running"}
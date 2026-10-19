from fastapi import APIRouter
from pydantic import BaseModel

from agents.emergency_classifier_agent import classify_emergency

router = APIRouter()


class EmergencyClassifyRequest(BaseModel):
    symptom: str


@router.post("/classify-emergency")
async def classify_emergency_route(request: EmergencyClassifyRequest):
    return classify_emergency(request.symptom)

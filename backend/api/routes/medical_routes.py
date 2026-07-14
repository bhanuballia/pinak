from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Optional

from medical_astrology.ayur_engine import AyurEngine

router = APIRouter()
ayur_engine = AyurEngine()

class MedicalRequest(BaseModel):
    natal_positions: Dict[str, float]
    transit_positions: Optional[Dict[str, float]] = None

@router.post("/medical-analysis")
def calculate_medical_analysis(request: MedicalRequest):
    return ayur_engine.calculate_medical_report(request.natal_positions, request.transit_positions)

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Optional

from mundane_astrology.chaitra_engine import ChaitraEngine

router = APIRouter()
chaitra_engine = ChaitraEngine()

class ChaitraRequest(BaseModel):
    year: int
    lat: float
    lon: float

@router.post("/chaitra-chart")
def generate_chaitra_chart(request: ChaitraRequest):
    result = chaitra_engine.calculate_chaitra_chart(request.year, request.lat, request.lon)
    return result

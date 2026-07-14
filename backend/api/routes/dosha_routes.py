from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any

from panchang.dosha_calculator import DoshaCalculator

router = APIRouter()
calculator = DoshaCalculator()

class DoshaRequest(BaseModel):
    moon_sign: int
    karana: str
    nakshatra: str
    pada: int

@router.post("/panchang-doshas")
def calculate_doshas(request: DoshaRequest):
    return calculator.evaluate_doshas(
        moon_sign=request.moon_sign,
        karana=request.karana,
        nakshatra=request.nakshatra,
        pada=request.pada
    )

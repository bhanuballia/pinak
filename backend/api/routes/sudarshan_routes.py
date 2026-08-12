# backend/api/routes/sudarshan_routes.py

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, List, Optional

from charts.sudarshan_engine import calculate_sudarshan_chakra

router = APIRouter()

class SudarshanRequest(BaseModel):
    planet_positions: List[Dict[str, Any]]
    ascendant_deg: float

@router.post("/sudarshan-chakra")
def compute_sudarshan_chakra(request: SudarshanRequest):
    result = calculate_sudarshan_chakra(
        planet_positions=request.planet_positions,
        ascendant_deg=request.ascendant_deg
    )
    return result

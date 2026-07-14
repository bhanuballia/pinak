from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Optional

from mundane_astrology.kurma_engine import KurmaEngine

router = APIRouter()
kurma_engine = KurmaEngine()

class KurmaRequest(BaseModel):
    transit_planets: Optional[Dict[str, float]] = None

@router.post("/kurma-chakra")
def calculate_kurma_chakra(request: KurmaRequest):
    result = kurma_engine.calculate_kurma_chakra(request.transit_planets)
    return result

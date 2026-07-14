from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Optional

from mundane_astrology.sanghatta_engine import SanghattaEngine

router = APIRouter()
sanghatta_engine = SanghattaEngine()

class SanghattaRequest(BaseModel):
    transit_planets: Optional[Dict[str, float]] = None

@router.post("/sanghatta-chakra")
def calculate_sanghatta_chakra(request: SanghattaRequest):
    return sanghatta_engine.calculate_sanghatta(request.transit_planets)

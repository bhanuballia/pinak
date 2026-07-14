from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any

from kota_chakra.kota_engine import KotaEngine

router = APIRouter()
kota_engine = KotaEngine()

class KotaRequest(BaseModel):
    moon_longitude: float
    transit_planets: Dict[str, float]

@router.post("/kota-chakra")
def calculate_kota_chakra(request: KotaRequest):
    # Get Janma Nakshatra (28 system) from Moon longitude
    idx_28, name = kota_engine.get_28_nakshatra(request.moon_longitude)
    
    # Generate the map
    chakra_map = kota_engine.generate_kota_chakra(idx_28)
    
    # Calculate vulnerability
    vulnerability_data = kota_engine.calculate_vulnerability(
        chakra_map, 
        request.transit_planets
    )
    
    return {
        "janma_nakshatra": name,
        "chakra_map": chakra_map,
        "vulnerability": vulnerability_data
    }

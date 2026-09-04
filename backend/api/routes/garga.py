from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
from prediction.garga_sutras import evaluate_garga_sutras, calculate_name_akshar_predictions

router = APIRouter()

@router.post("/garga-sutras")
def api_garga_sutras(payload: Dict = Body(...)):
    """
    Evaluates Garga Muni sutras based on the provided natal chart data.
    Expected payload is the full report data (or at least planet_positions and chart).
    """
    try:
        sutras = evaluate_garga_sutras(payload)
        return {"sutras": sutras}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/name-predictions")
def api_name_predictions(name: str):
    """
    Calculates Nakshatra, Rashi, marriage age, and finance based on Name Akshar.
    """
    try:
        result = calculate_name_akshar_predictions(name)
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

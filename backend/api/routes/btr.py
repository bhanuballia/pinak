from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any, List
from api.services.btr_logic import calculate_btr
import time

router = APIRouter()

@router.post("/rectify")
async def rectify_birth_time(payload: Dict = Body(...)):
    """
    Accepts date_of_birth, start_time, end_time, lat, lon, gender, and life_events.
    Returns the rectified birth time, score, and chart.
    """
    try:
        date_str = payload.get("date_of_birth")
        lat = payload.get("latitude")
        lon = payload.get("longitude")
        start_time = payload.get("start_time")
        end_time = payload.get("end_time")
        gender = payload.get("gender")
        life_events = payload.get("life_events", [])
        
        if not all([date_str, lat, lon, start_time, end_time, gender]):
            raise HTTPException(status_code=400, detail="Missing required parameters")
            
        start_t = time.time()
        
        result = calculate_btr(
            date_str=date_str,
            lat=float(lat),
            lon=float(lon),
            start_time_str=start_time,
            end_time_str=end_time,
            gender=gender,
            life_events=life_events
        )
        
        end_t = time.time()
        print(f"[BTR] Processed in {end_t - start_t:.2f} seconds.")
        
        return result
        
    except Exception as e:
        print(f"[BTR ERROR] {e}")
        raise HTTPException(status_code=500, detail=str(e))

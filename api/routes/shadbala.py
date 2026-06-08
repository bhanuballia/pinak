# api/routes/shadbala.py
"""
Shadbala and planetary strength analysis endpoint.
"""
from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any
import datetime
from astronomy.julian import datetime_to_julian
from charts.rashi_chart import build_rashi_chart
from core.analysis.shadbala_engine import compute_shadbala

router = APIRouter()

def _calculate_shadbala_for_chart(date: str, time: str, tz_offset: float, lat: float, lon: float) -> Dict[str, Any]:
    try:
        y, m, d = [int(x) for x in date.split("-")]
        tp = [int(x) for x in time.split(":")]
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid date/time format: {exc}")
        
    dt_local = datetime.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
    dt_utc = dt_local - datetime.timedelta(hours=tz_offset)
    jd_ut = datetime_to_julian(dt_utc)
    
    chart = build_rashi_chart(jd_ut, lat, lon, house_system="W", style="north")
    chart["jd_ut"] = jd_ut
    
    # Inject birth_info for temporal calculations (Kala Bala)
    chart["birth_info"] = {
        "is_day": 6 <= dt_local.hour < 18,
        "weekday": (dt_local.weekday() + 1) % 7, # 0=Sun, 1=Mon...
        "birth_hour": dt_local.hour
    }
    
    # Calculate Shadbala using the integrated engine
    result = compute_shadbala(chart)
    return result

@router.get("")
def get_shadbala(
    date: str = Query(...),
    time: str = Query("00:00:00"),
    tz_offset: float = Query(0.0),
    lat: float = Query(...),
    lon: float = Query(...)
):
    """
    GET endpoint to calculate Shadbala strength from query parameters.
    """
    return _calculate_shadbala_for_chart(date, time, tz_offset, lat, lon)

@router.post("")
def post_shadbala(payload: Dict[str, Any] = Body(...)):
    """
    POST endpoint to calculate Shadbala strength from a JSON payload.
    """
    try:
        date = payload["date"]
        time = payload["time"]
        tz_offset = float(payload.get("tz_offset", 0.0))
        lat = float(payload["lat"])
        lon = float(payload["lon"])
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing payload field: {e}")
        
    return _calculate_shadbala_for_chart(date, time, tz_offset, lat, lon)

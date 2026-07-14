# api/routes/horoscope.py
"""
Simple horoscope route: compute planetary positions for a provided datetime+place.
"""
from __future__ import annotations
from fastapi import APIRouter, Query, HTTPException
from typing import Optional
import datetime

from astronomy.julian import datetime_to_julian
from astronomy.positions import get_all_planetary_positions

router = APIRouter()

from charts.divisional.builder import get_varga_sign

@router.get("/positions")
def positions(
    date: str = Query(..., description="YYYY-MM-DD"),
    time: str = Query("00:00:00", description="HH:MM[:SS]"),
    tz_offset: float = Query(0.0, description="Timezone offset in hours (east positive)"),
    varga: int = Query(1, description="D-chart number")
):
    try:
        dt = datetime.datetime.fromisoformat(date + " " + time)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid date/time: {exc}")

    # convert to UTC by subtracting tz_offset
    dt_utc = dt - datetime.timedelta(hours=float(tz_offset))
    jd = datetime_to_julian(dt_utc)
    
    pos = get_all_planetary_positions(jd)
    if varga > 1:
        for p_name, p_data in pos.items():
            lon = p_data.get("sidereal", {}).get("lon")
            if lon is not None:
                v_sign = get_varga_sign(float(lon), varga)
                p_data["sidereal"]["sign_index"] = v_sign

    return {"jd_ut": jd, "positions": pos}

@router.get("/current_grid")
def current_grid(
    date: str = Query(..., description="YYYY-MM-DD"),
    time: str = Query("00:00:00", description="HH:MM[:SS]"),
    tz_offset: float = Query(0.0, description="Timezone offset in hours (east positive)"),
    lat: float = Query(28.6139, description="Latitude"),
    lon: float = Query(77.2090, description="Longitude")
):
    from charts.rashi_chart import build_rashi_chart
    try:
        dt = datetime.datetime.fromisoformat(date + " " + time)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid date/time: {exc}")

    dt_utc = dt - datetime.timedelta(hours=float(tz_offset))
    jd = datetime_to_julian(dt_utc)
    
    positions = get_all_planetary_positions(jd)
    chart = build_rashi_chart(jd, lat, lon, house_system="W", style="north")
    
    return {
        "jd_ut": jd, 
        "positions": positions,
        "chart": chart,
        "metadata": {
            "date": date,
            "time": time,
            "lat": lat,
            "lon": lon,
            "tz_offset": tz_offset
        }
    }

@router.post("/predict")
def predict_horoscope(payload: dict):
    """
    Get Daily, Monthly, and Yearly predictions based on natal moon position and current JD.
    """
    from prediction.horoscope_engine import get_prediction
    from astronomy.julian import datetime_to_julian
    import datetime as _dt

    try:
        natal_moon_lon = float(payload["natal_moon_lon"])
        # optional: current_jd (defaults to now)
        jd_now = payload.get("jd_now")
        if not jd_now:
            jd_now = datetime_to_julian(_dt.datetime.utcnow())
        
        res = get_prediction(natal_moon_lon, jd_now)
        return res
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing {e}")
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# backend/api/astrology_routes.py

from fastapi import APIRouter, HTTPException, Query
from datetime import datetime
from enterprise_astrology.backend.astronomy.swiss_ephemeris import SwissEphemerisEngine
from enterprise_astrology.backend.astronomy.ayanamsa_engine import get_ayanamsa_offset
from enterprise_astrology.backend.astronomy.eclipse_engine import find_nearest_eclipse

router = APIRouter()
ephe_engine = SwissEphemerisEngine()

@router.get("/positions")
def get_planetary_positions(
    date: str = Query("2026-05-20", description="Date formatted as YYYY-MM-DD"),
    time: str = Query("12:00:00", description="Time formatted as HH:MM:SS"),
    tz_offset: float = Query(5.5, description="Timezone offset in hours")
):
    try:
        y, m, d = map(int, date.split("-"))
        h, mn, s = map(int, time.split(":"))
        dt = datetime(y, m, d, h, mn, s)
        
        # Planet IDs in Swiss Ephemeris: Sun=0, Moon=1, Mercury=2, Venus=3, Mars=4, Jupiter=5, Saturn=6
        planets = {
            "Sun": 0,
            "Moon": 1,
            "Mercury": 2,
            "Venus": 3,
            "Mars": 4,
            "Jupiter": 5,
            "Saturn": 6
        }
        
        results = {}
        for p_name, p_id in planets.items():
            results[p_name] = ephe_engine.planetary_position(dt, p_id)
            
        return {
            "date": date,
            "time": time,
            "tz_offset": tz_offset,
            "positions": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate positions: {str(e)}")

@router.get("/ayanamsa")
def get_ayanamsa(
    jd: float = Query(2461181.0, description="Julian Date UT")
):
    try:
        offset = get_ayanamsa_offset(jd)
        return {
            "jd": jd,
            "ayanamsa_offset": offset,
            "system": "Lahiri"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate Ayanamsa: {str(e)}")

@router.get("/eclipse")
def get_nearest_eclipse(
    jd: float = Query(2461181.0, description="Julian Date UT")
):
    try:
        eclipse_info = find_nearest_eclipse(jd)
        return eclipse_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate nearest eclipse: {str(e)}")

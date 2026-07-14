# backend/api/routes/vastu.py
from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any, Optional
import datetime
from astronomy.julian import datetime_to_julian
from astrology.vastu import analyze_astro_vastu

router = APIRouter(prefix="/api/vastu", tags=["Vastu Shastra"])

@router.post("/analyze")
async def analyze_vastu_layout(payload: Dict[str, Any] = Body(...)):
    """
    Computes Vastu Compatibility and Astro-Vastu planetary strengths.
    """
    try:
        date_str = payload.get("date")
        time_str = payload.get("time", "12:00:00")
        tz_offset = float(payload.get("tz_offset", 5.5))
        lat = float(payload.get("lat", 28.6139))
        lon = float(payload.get("lon", 77.2090))
        layout = payload.get("layout", {}) # Optional dictionary of room placements
        property_type = payload.get("property_type", "residential")

        if not date_str:
            raise HTTPException(status_code=400, detail="Missing birth date")

        # Parse date and time
        try:
            dt = datetime.datetime.fromisoformat(date_str + " " + time_str)
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Invalid date/time: {exc}")

        # Compute UTC datetime and Julian Date
        dt_utc = dt - datetime.timedelta(hours=tz_offset)
        jd = datetime_to_julian(dt_utc)

        # Analyze Astro-Vastu
        analysis = analyze_astro_vastu(jd, lat, lon, layout, property_type)
        return analysis

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

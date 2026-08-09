# api/routes/dasha.py
"""
Dasha endpoints (basic).
"""
from __future__ import annotations
from fastapi import APIRouter, Query, HTTPException
from typing import Optional
import datetime

from astronomy.julian import datetime_to_julian
from panchang.nakshatra import compute_nakshatra_from_longitude  # fallback import if needed
from panchang.nakshatra import compute_nakshatra_from_lon  # we defined this previously
from panchang.nakshatra import NAKSHATRA_SIZE_DEG  # may not be exported; but we'll compute differently
from panchang.nakshatra import get_nakshatra  # returns by JD
from dasha.vimshottari import compute_vimshottari

router = APIRouter()

@router.get("/vimshottari")
def vimshottari(
    date: str = Query(...),
    time: str = Query("00:00:00"),
    tz_offset: float = Query(0.0),
):
    try:
        dt = datetime.datetime.fromisoformat(date + " " + time)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid date/time: {exc}")
    dt_utc = dt - datetime.timedelta(hours=float(tz_offset))
    jd = datetime_to_julian(dt_utc)

    nak = get_nakshatra(jd)
    nak_index = nak["nakshatra_index"]
    sequence = compute_vimshottari(jd, nak_index, years_ahead=150)
    return {"birth_jd": jd, "nakshatra_index": nak_index, "vimshottari": sequence}

from fastapi import Body
from typing import Dict
from dasha.wealth_activation import compute_wealth_activation_timeline, derive_house_lords

@router.post("/wealth-activation")
def wealth_activation_endpoint(payload: Dict = Body(...)):
    try:
        jd_ut = float(payload.get("jd_ut", 0))
        moon_lon = float(payload.get("moon_lon", 0))
        
        # If house_lords passed directly, use them, otherwise derive from ascendant
        house_lords = payload.get("house_lords")
        if not house_lords:
            ascendant_deg = float(payload.get("ascendant", 0))
            house_lords = derive_house_lords(ascendant_deg)
        else:
            # ensure keys are ints
            house_lords = {int(k): str(v) for k, v in house_lords.items()}

        result = compute_wealth_activation_timeline(
            jd_ut=jd_ut,
            moon_sidereal_long=moon_lon,
            house_lords=house_lords,
            years_ahead=float(payload.get("years", 80.0))
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


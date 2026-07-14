from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
import datetime

from astronomy.julian import datetime_to_julian
from panchang.tithi_yoga_karana import compute_sunrise_sunset_for_date
from charts.rashi_chart import build_rashi_chart
from charts.divisional.builder import build_varga_chart
from dasha.vimshottari import compute_vimshottari_full
from core.utils import ZODIAC_SIGNS, get_sign_index

router = APIRouter()

@router.post("/calculate")
def calculate_sunrise_chart(payload: Dict[str, Any] = Body(...)):
    try:
        date = payload.get("date") or payload.get("birth_date")
        time = payload.get("time") or payload.get("birth_time") or "12:00:00"
        lat = float(payload["lat"])
        lon = float(payload["lon"])
        tz_offset = float(payload.get("tz_offset", 0.0))
        
        y, m, d = [int(x) for x in date.split("-")]
        dt_local = datetime.date(y, m, d)
        
        # 1. Get Sunrise UT
        sunrise_info = compute_sunrise_sunset_for_date(dt_local, lat, lon, tz_offset)
        sunrise_jd_ut = sunrise_info.get("sunrise_jd_ut")
        sunrise_local_str = sunrise_info.get("sunrise_local")
        
        if not sunrise_jd_ut:
            raise HTTPException(status_code=500, detail="Could not calculate Sunrise for the given date and location.")

        # 2. Build D1 Chart specifically for the Sunrise JD!
        d1_chart = build_rashi_chart(sunrise_jd_ut, lat, lon)
        
        # 3. Build D9 (Navamsha) Chart specifically for the Sunrise JD!
        d9_chart = build_varga_chart(9, sunrise_jd_ut, lat, lon)
        
        # 4. Compute Vimshottari Dasha sequence for the Moon's longitude *at Sunrise*!
        sunrise_moon_lon = d1_chart["planet_positions"]["Moon"]["sidereal"]["lon"]
        dasha_sequence = compute_vimshottari_full(sunrise_jd_ut, sunrise_moon_lon, years_ahead=120)
        
        # 5. Build standard D1 chart for birth time to display in top left
        tp = [int(x) for x in time.split(":")]
        dt_local_birth = datetime.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
        dt_utc_birth = dt_local_birth - datetime.timedelta(hours=tz_offset)
        jd_ut_birth = datetime_to_julian(dt_utc_birth)
        standard_d1_chart = build_rashi_chart(jd_ut_birth, lat, lon)
        
        return {
            "sunrise_local": sunrise_local_str,
            "sunrise_jd_ut": sunrise_jd_ut,
            "standard_d1_chart": standard_d1_chart,
            "d1_chart": d1_chart,
            "d9_chart": d9_chart,
            "dashas": dasha_sequence
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

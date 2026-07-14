# api/routes/special_lagnas.py
from fastapi import APIRouter, Query, HTTPException
import datetime

from astronomy.julian import datetime_to_julian
from charts.rashi_chart import build_rashi_chart
from charts.houses import compute_whole_sign_houses, get_house_number
from panch_pakshi.sunrise_engine import get_sunrise_sunset

router = APIRouter()

def _parse_dt(date: str, time: str) -> datetime.datetime:
    return datetime.datetime.fromisoformat(date + " " + time)

def _format_deg(deg: float) -> str:
    signs = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"]
    sign_idx = int(deg / 30) % 12
    rem = deg % 30
    d = int(rem)
    m = int((rem - d) * 60)
    return f"{d:02d}{signs[sign_idx]}{m:02d}"

def _build_chart_for_lagna(base_chart: dict, lagna_deg: float) -> dict:
    import copy
    from charts.rashi_chart import get_sign_name
    
    new_chart = copy.deepcopy(base_chart)
    new_chart["ascendant"] = lagna_deg
    new_chart["ascendant_sign_index"] = int(lagna_deg / 30) % 12
    
    houses_data = compute_whole_sign_houses(lagna_deg)
    cusps = houses_data["cusps"]
    
    houses_dict = {}
    for h in range(1, 13):
        cusp_deg = cusps[h] if h < len(cusps) and cusps[h] is not None else None
        sign_name = get_sign_name(cusp_deg) if cusp_deg is not None else ""
        houses_dict[str(h)] = {
            "house_number": h,
            "planets": [],
            "cusp_deg": cusp_deg,
            "sign_name": sign_name
        }
        
    for p_name, p_data in new_chart.get("planet_positions", {}).items():
        if isinstance(p_data, dict) and "sidereal" in p_data:
            p_lon = p_data["sidereal"]["lon"]
        else:
            p_lon = p_data  # fallback just in case
        h_num = get_house_number(p_lon, cusps)
        houses_dict[str(h_num)]["planets"].append({"name": p_name, "norm_deg": p_lon})
        
    new_chart["houses"] = houses_dict
    return new_chart

@router.get("/special_lagnas")
def special_lagnas(
    date: str = Query(...),
    time: str = Query("00:00:00"),
    tz_offset: float = Query(0.0),
    lat: float = Query(...),
    lon: float = Query(...)
):
    try:
        dt_local = _parse_dt(date, time)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))
        
    dt_utc = dt_local - datetime.timedelta(hours=float(tz_offset))
    jd_birth = datetime_to_julian(dt_utc)
    
    # Build standard D1 chart for planet positions
    base_chart = build_rashi_chart(jd_birth, lat, lon, house_system="W")
    
    # Get Sunrise for the birth date
    sunrise_dt_local, sunset_dt_local = get_sunrise_sunset(lat, lon, dt_local.date(), tz_offset)
    
    # If birth is before sunrise, we usually use previous day's sunrise for ishta kala, but for simplicity 
    # we'll just take the time difference. Some systems always use the current day's sunrise. 
    # Let's use the current day's sunrise for the basic math.
    if dt_local < sunrise_dt_local:
        # Use previous day's sunrise
        sunrise_dt_local, _ = get_sunrise_sunset(lat, lon, dt_local.date() - datetime.timedelta(days=1), tz_offset)
        
    ishta_hours = (dt_local - sunrise_dt_local).total_seconds() / 3600.0
    
    # Get Sun's position at sunrise
    jd_sunrise = datetime_to_julian(sunrise_dt_local - datetime.timedelta(hours=float(tz_offset)))
    sunrise_chart = build_rashi_chart(jd_sunrise, lat, lon)
    sun_data = sunrise_chart["planet_positions"]["Sun"]
    if isinstance(sun_data, dict) and "sidereal" in sun_data:
        sun_deg_at_sunrise = sun_data["sidereal"]["lon"]
    else:
        sun_deg_at_sunrise = sun_data
    
    # Calculations
    # Bhava Lagna: moves 1 sign (30 deg) per 2 hours = 15 deg/hr
    bhava_deg = (sun_deg_at_sunrise + ishta_hours * 15.0) % 360
    
    # Hora Lagna: moves 1 sign (30 deg) per 1 hour = 30 deg/hr
    hora_deg = (sun_deg_at_sunrise + ishta_hours * 30.0) % 360
    
    # Ghatika Lagna: moves 1 sign (30 deg) per 24 mins (0.4 hours) = 75 deg/hr
    ghatika_deg = (sun_deg_at_sunrise + ishta_hours * 75.0) % 360
    
    return {
        "bhava": {
            "deg": bhava_deg,
            "formatted": _format_deg(bhava_deg),
            "chart": _build_chart_for_lagna(base_chart, bhava_deg)
        },
        "hora": {
            "deg": hora_deg,
            "formatted": _format_deg(hora_deg),
            "chart": _build_chart_for_lagna(base_chart, hora_deg)
        },
        "ghatika": {
            "deg": ghatika_deg,
            "formatted": _format_deg(ghatika_deg),
            "chart": _build_chart_for_lagna(base_chart, ghatika_deg)
        }
    }

from fastapi import APIRouter, HTTPException, Body
from typing import Dict
import datetime
from astronomy.julian import datetime_to_julian
from charts.rashi_chart import build_rashi_chart
from charts.kalachakra import calculate_kalachakra_wheel

router = APIRouter()

@router.post("/kalachakra")
def api_kalachakra(payload: Dict = Body(...)):
    try:
        date_str = payload["date"]
        time_str = payload["time"]
        tz_offset = float(payload.get("tz_offset", 0.0))
        lat = float(payload["lat"])
        lon = float(payload["lon"])
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing {e}")

    # Calculate Birth JD
    y, m, d = [int(x) for x in date_str.split("-")]
    tp = [int(x) for x in time_str.split(":")]
    dt_local = datetime.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
    dt_utc = dt_local - datetime.timedelta(hours=tz_offset)
    jd_birth_ut = datetime_to_julian(dt_utc)

    # Build standard rashi chart to get exact longitudes
    chart_data = build_rashi_chart(jd_birth_ut, lat, lon)
    
    planet_pos_dict = {}
    for p_name, data in chart_data["planet_positions"].items():
        planet_pos_dict[p_name] = data["sidereal"]["lon"]

    planet_pos_dict["Lagna"] = chart_data.get("ascendant_deg", 0.0)

    # Calculate kalachakra properties
    kalachakra_data = calculate_kalachakra_wheel(planet_pos_dict, chart_data.get("ascendant_sign_index", 0))

    return kalachakra_data

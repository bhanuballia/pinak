# api/routes/naming.py
from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
from fastapi.responses import JSONResponse
from astronomy.julian import datetime_to_julian
import datetime as _dt

from charts.rashi_chart import build_rashi_chart
from panchang.tithi_yoga_karana import compute_nakshatra
from api.swar_siddhanta import get_dominant_tattva, get_beneficial_tattva, get_swar_recommendations, get_avakahada_syllable

router = APIRouter()

@router.post("/comprehensive")
def comprehensive_naming(payload: Dict = Body(...)):
    try:
        date = payload["date"]
        time = payload["time"]
        tz_offset = float(payload.get("tz_offset", 0.0))
        lat = float(payload["lat"])
        lon = float(payload["lon"])
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing {e}")
        
    y, m, d = [int(x) for x in date.split("-")]
    tp = [int(x) for x in time.split(":")]
    dt_local = _dt.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
    dt_utc = dt_local - _dt.timedelta(hours=tz_offset)
    jd_ut = datetime_to_julian(dt_utc)
    
    # 1. Avakahada Chakra (Nakshatra)
    nak_info = compute_nakshatra(jd_ut)
    nakshatra_name = nak_info.get("nakshatra_name", "")
    pada = nak_info.get("pada", 1)
    avakahada_syllable = get_avakahada_syllable(nakshatra_name, pada)
    
    # 2. Swar Siddhanta
    # Need Ascendant for Dominant Tattva
    chart = build_rashi_chart(jd_ut, lat, lon)
    
    ascendant_house = chart.get("houses", {}).get(1, {})
    # For now, let's assume we can get it or fallback
    ascendant_sign_name = ascendant_house.get("sign_name", "Aries")
    sign_names = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    try:
        asc_index = sign_names.index(ascendant_sign_name) + 1
    except ValueError:
        asc_index = 1

    dominant_tattva = get_dominant_tattva(asc_index)
    dominant_syllables = get_swar_recommendations(dominant_tattva)
    
    beneficial_tattva, strongest_planet = get_beneficial_tattva(jd_ut, lat, lon)
    beneficial_syllables = get_swar_recommendations(beneficial_tattva)
    
    return JSONResponse({
        "avakahada": {
            "nakshatra": nakshatra_name,
            "pada": pada,
            "syllable": avakahada_syllable
        },
        "swar_siddhanta": {
            "dominant": {
                "tattva": dominant_tattva,
                "source": "Ascendant Sign",
                "syllables": dominant_syllables
            },
            "beneficial": {
                "tattva": beneficial_tattva,
                "source": f"Strongest Planet ({strongest_planet})",
                "syllables": beneficial_syllables
            }
        }
    })

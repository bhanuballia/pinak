# api/routes/naming.py
from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import Dict, Any, Optional
from fastapi.responses import JSONResponse
from astronomy.julian import datetime_to_julian
import datetime as _dt

from charts.rashi_chart import build_rashi_chart
from panchang.tithi_yoga_karana import compute_nakshatra
from api.swar_siddhanta import get_dominant_tattva, get_beneficial_tattva, get_swar_recommendations, get_avakahada_syllable
import os
try:
    import google.generativeai as genai
    _HAS_GEMINI = True
except ImportError:
    _HAS_GEMINI = False

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

SIGN_LORDS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

PLANET_DOMAINS = {
    "Sun": ["Government", "Administration", "Medicine", "Gold", "Leadership"],
    "Moon": ["Liquids", "Food", "Public Relations", "Travel", "Hospitality"],
    "Mars": ["Engineering", "Construction", "Real Estate", "Surgery", "Machinery"],
    "Mercury": ["Business", "Trade", "Communication", "IT", "Accounting", "Writing"],
    "Jupiter": ["Education", "Finance", "Law", "Consulting", "Religion"],
    "Venus": ["Arts", "Fashion", "Beauty", "Luxury", "Entertainment", "Design"],
    "Saturn": ["Mining", "Agriculture", "Oil", "Iron", "Real Estate", "Labor-intensive"],
    "Rahu": ["Technology", "Imports", "Foreign Travel", "Aviation", "Innovation"],
    "Ketu": ["Research", "Occult", "Micro-technology", "Spirituality", "Healing"]
}

class BusinessNamingRequest(BaseModel):
    date: str
    time: str
    lat: float
    lon: float
    tz_offset: Optional[float] = 0.0

@router.post("/business-naming")
def business_naming(payload: BusinessNamingRequest):
    try:
        date = payload.date
        time = payload.time
        tz_offset = payload.tz_offset
        lat = payload.lat
        lon = payload.lon
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid payload: {e}")
        
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
    if not avakahada_syllable:
        avakahada_syllable = "A" # Fallback
        
    # 2. 10th House Lord Calculation
    chart = build_rashi_chart(jd_ut, lat, lon)
    tenth_house = chart.get("houses", {}).get(10, {})
    tenth_sign = tenth_house.get("sign_name", "Aries")
    tenth_lord = SIGN_LORDS.get(tenth_sign, "Mars")
    
    recommended_domains = PLANET_DOMAINS.get(tenth_lord, ["Business", "Trade", "Consulting"])
    
    mock_names = []
    
    if _HAS_GEMINI and os.getenv("GEMINI_API_KEY"):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = (f"You are a Vedic Astrology expert in business naming. "
                  f"Generate exactly 5 modern, aesthetic, and professional business names that start EXACTLY with the syllable/letters '{avakahada_syllable}'. "
                  f"The names must be relevant to these industries: {', '.join(recommended_domains)}. "
                  f"Return ONLY a valid JSON array of 5 objects. Each object MUST have exactly two keys: 'english' (name in English script) and 'hindi' (the exact same name written ENTIRELY in Devanagari script, including transliterating the starting syllable '{avakahada_syllable}' into Hindi). "
                  f"Do NOT include commas in the names themselves. Output ONLY the JSON, without markdown formatting.")
        try:
            response = model.generate_content(prompt)
            if response and response.text:
                import json
                text = response.text.strip()
                if text.startswith('```json'): text = text[7:]
                elif text.startswith('```'): text = text[3:]
                if text.endswith('```'): text = text[:-3]
                names_json = json.loads(text.strip())
                if isinstance(names_json, list) and all(isinstance(x, dict) for x in names_json):
                    mock_names = names_json[:5]
        except Exception as e:
            print(f"Error generating names with Gemini: {e}")
            
    if not mock_names:
        # Fallback algorithmic generation
        domain_suffix = recommended_domains[0][:4] if recommended_domains else "Corp"
        mock_names = [
            {"english": f"{avakahada_syllable} Solutions", "hindi": f"{avakahada_syllable} सॉल्यूशंस"},
            {"english": f"{avakahada_syllable} {recommended_domains[0]}", "hindi": f"{avakahada_syllable} {recommended_domains[0]}"},
            {"english": f"{avakahada_syllable}nova", "hindi": f"{avakahada_syllable}नोवा"},
            {"english": f"{avakahada_syllable}nex", "hindi": f"{avakahada_syllable}नेक्स"},
            {"english": f"{avakahada_syllable} Global", "hindi": f"{avakahada_syllable} ग्लोबल"}
        ]
        
    return JSONResponse({
        "syllable": avakahada_syllable,
        "tenth_house": tenth_sign,
        "tenth_lord": tenth_lord,
        "domains": recommended_domains,
        "mock_names": mock_names[:5]
    })

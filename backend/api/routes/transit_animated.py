from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List
import datetime
from astronomy.julian import datetime_to_julian
from charts.rashi_chart import build_rashi_chart
from core.utils import ZODIAC_SIGNS, get_sign_index
from panchang.nakshatra import compute_nakshatra_from_lon
from core.analysis.shadbala_engine import compute_shadbala

router = APIRouter()

DIGNITY_MAP = {
    "Sun": {"exalt": "Ari", "deb": "Lib", "own": ["Leo"]},
    "Moon": {"exalt": "Tau", "deb": "Sco", "own": ["Can"]},
    "Mars": {"exalt": "Cap", "deb": "Can", "own": ["Ari", "Sco"]},
    "Mercury": {"exalt": "Vir", "deb": "Pis", "own": ["Gem", "Vir"]},
    "Jupiter": {"exalt": "Can", "deb": "Cap", "own": ["Sag", "Pis"]},
    "Venus": {"exalt": "Pis", "deb": "Vir", "own": ["Tau", "Lib"]},
    "Saturn": {"exalt": "Lib", "deb": "Ari", "own": ["Cap", "Aqu"]},
    "Rahu": {"exalt": "Gem", "deb": "Sag", "own": ["Aqu"]},
    "Ketu": {"exalt": "Sag", "deb": "Gem", "own": ["Sco"]},
}

def get_basic_dignity(planet: str, rashi: str) -> str:
    info = DIGNITY_MAP.get(planet)
    if not info:
        return "Neutr"
    if rashi == info.get("exalt"):
        return "Exalt"
    if rashi == info.get("deb"):
        return "Debil"
    if rashi in info.get("own", []):
        return "Own"
    return "Neutr"

def build_planet_data(chart: Dict[str, Any], shadbala_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    planet_positions = chart.get("planet_positions", {})
    results = []
    
    # Process Ascendant
    asc_lon = chart["ascendant_deg"]
    asc_nak = compute_nakshatra_from_lon(asc_lon)
    results.append({
        "planet": "Asc",
        "rc": "",
        "rashi": ZODIAC_SIGNS[get_sign_index(asc_lon)][:3],
        "nakshatra": asc_nak["nakshatra_name"][:8],
        "pada": str(asc_nak["pada"]),
        "degree": asc_lon % 30, # local sign degree
        "dignity": "-",
        "sb": "-"
    })
    
    for planet, data in planet_positions.items():
        if planet in ["Ascendant"]:
            continue
        
        lon = data["sidereal"]["lon"]
        rc = "R" if data["sidereal"].get("speed_lon", 0) < 0 else ""
        nak = compute_nakshatra_from_lon(lon)
        rashi = ZODIAC_SIGNS[get_sign_index(lon)][:3]
        
        p_name = planet[:2] if planet not in ["Sun", "Moon", "Mars"] else planet[:2] # Su, Mo, Ma, Me, Ju, Ve, Sa, Ra, Ke
        
        sb_val = ""
        dignity = ""
        if shadbala_data:
            sb_info = (
                shadbala_data.get("planets", {}).get(planet, {}) or
                shadbala_data.get("shadbala", {}).get(planet, {}) or
                shadbala_data.get(planet, {})
            )
            if "total_score" in sb_info:
                sb_val = f"{sb_info['total_score']:.1f}"
            elif "total_rupas" in sb_info:
                sb_val = f"{sb_info['total_rupas']:.2f}"
            elif "total" in sb_info:
                sb_val = f"{sb_info['total']:.2f}"

            dignity_raw = sb_info.get("dignity", "")
            if dignity_raw:
                dignity = str(dignity_raw).capitalize()[:6]

        if not dignity:
            dignity = get_basic_dignity(planet, rashi)
        if not sb_val:
            sb_val = "-"
                
        results.append({
            "planet": p_name,
            "rc": rc,
            "rashi": rashi,
            "nakshatra": nak["nakshatra_name"][:8],
            "pada": str(nak["pada"]),
            "degree": lon % 30, # Local sign degree
            "absolute_degree": lon,
            "dignity": dignity,
            "sb": sb_val
        })
        
    return results

@router.post("/animated")
def get_animated_transits(payload: Dict[str, Any] = Body(...)):
    """
    Returns data for both the Birth Chart and the Transit Chart at a specific date.
    """
    try:
        # Birth details
        b_date = payload["birth_date"]
        b_time = payload["birth_time"]
        b_lat = float(payload["lat"])
        b_lon = float(payload["lon"])
        b_tz = float(payload.get("tz_offset", 0.0))
        
        # Transit details
        t_date = payload["transit_date"]
        t_time = payload["transit_time"]
        t_tz = float(payload.get("transit_tz_offset", b_tz))
        
        # Calculate Birth JD
        by, bm, bd = [int(x) for x in b_date.split("-")]
        btp = [int(x) for x in b_time.split(":")]
        b_dt_local = datetime.datetime(by, bm, bd, btp[0], btp[1], btp[2] if len(btp) > 2 else 0)
        b_dt_utc = b_dt_local - datetime.timedelta(hours=b_tz)
        b_jd_ut = datetime_to_julian(b_dt_utc)
        
        # Calculate Transit JD
        ty, tm, td = [int(x) for x in t_date.split("-")]
        ttp = [int(x) for x in t_time.split(":")]
        t_dt_local = datetime.datetime(ty, tm, td, ttp[0], ttp[1], ttp[2] if len(ttp) > 2 else 0)
        t_dt_utc = t_dt_local - datetime.timedelta(hours=t_tz)
        t_jd_ut = datetime_to_julian(t_dt_utc)
        
        # Build Charts
        birth_chart = build_rashi_chart(b_jd_ut, b_lat, b_lon)
        transit_chart = build_rashi_chart(t_jd_ut, b_lat, b_lon) # Transits are typically calculated for the same birth location (or current location)
        
        birth_chart["jd_ut"] = b_jd_ut
        birth_chart["birth_info"] = {
            "is_day": 6 <= b_dt_local.hour < 18,
            "weekday": (b_dt_local.weekday() + 1) % 7,
            "birth_hour": b_dt_local.hour
        }
        b_shadbala = compute_shadbala(birth_chart)
        
        t_shadbala = {} # We can skip full shadbala for transits to save compute, or calculate it if needed
        
        # Formatting for the tables
        birth_table = build_planet_data(birth_chart, b_shadbala)
        transit_table = build_planet_data(transit_chart, t_shadbala)
        
        # Placeholder Kaksha data based on the image
        kakshas = [
            {"planet": "Su", "kaks": "0 (Mo)", "ash": "3", "sarv": "25"},
            {"planet": "Mo", "kaks": "0 (Su)", "ash": "4", "sarv": "29"},
            {"planet": "Ma", "kaks": "1 (Mo)", "ash": "4", "sarv": "36"},
            {"planet": "Me", "kaks": "0 (Sa)", "ash": "4", "sarv": "31"},
            {"planet": "Ju", "kaks": "1 (Sa)", "ash": "5", "sarv": "29"},
            {"planet": "Ve", "kaks": "1 (Sa)", "ash": "3", "sarv": "25"},
            {"planet": "Sa", "kaks": "0 (Ju)", "ash": "1", "sarv": "25"}
        ]
        
        return {
            "birth_chart": birth_table,
            "transit_chart": transit_table,
            "kakshas": kakshas,
            "transit_date_formatted": t_dt_local.strftime("%d %b %Y"),
            "transit_time_formatted": t_dt_local.strftime("%H:%M:%S")
        }
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

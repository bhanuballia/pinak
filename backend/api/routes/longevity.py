from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
import datetime

from astronomy.julian import datetime_to_julian
from charts.rashi_chart import build_rashi_chart, get_sign_name
from panch_pakshi.sunrise_engine import get_sunrise_sunset

router = APIRouter()

class LongevityRequest(BaseModel):
    date: str
    time: str
    lat: float
    lon: float
    tz_offset: float

def get_sign_index(lon_deg: float) -> int:
    return int(lon_deg / 30) % 12

def get_sign_modality(sign_idx: int) -> str:
    # 0=Aries (Movable), 1=Taurus (Fixed), 2=Gemini (Dual), 3=Cancer (Movable)...
    mod = sign_idx % 3
    if mod == 0: return "Movable"
    elif mod == 1: return "Fixed"
    else: return "Dual"

def get_longevity_from_pair(mod1: str, mod2: str) -> str:
    if (mod1 == "Movable" and mod2 == "Movable") or (mod1 == "Fixed" and mod2 == "Dual") or (mod1 == "Dual" and mod2 == "Fixed"):
        return "Purnayu" # Long
    if (mod1 == "Fixed" and mod2 == "Fixed") or (mod1 == "Movable" and mod2 == "Dual") or (mod1 == "Dual" and mod2 == "Movable"):
        return "Alpayu" # Short
    if (mod1 == "Dual" and mod2 == "Dual") or (mod1 == "Movable" and mod2 == "Fixed") or (mod1 == "Fixed" and mod2 == "Movable"):
        return "Madhyayu" # Medium
    return "Unknown"

@router.post("/analysis")
def analyze_longevity(payload: LongevityRequest):
    try:
        try:
            dt_local = datetime.datetime.fromisoformat(f"{payload.date} {payload.time}")
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f"Invalid date/time format: {exc}")
            
        dt_utc = dt_local - datetime.timedelta(hours=payload.tz_offset)
        jd_birth = datetime_to_julian(dt_utc)
        
        # 1. Standard D1 Chart
        base_chart = build_rashi_chart(jd_birth, payload.lat, payload.lon, house_system="W")
        planets = base_chart["planet_positions"]
        
        # Extract specific longitudes
        def get_lon(p_key):
            data = planets.get(p_key)
            if isinstance(data, dict) and "sidereal" in data:
                return data["sidereal"]["lon"]
            return data
            
        asc_deg = base_chart["ascendant_deg"]
        moon_deg = get_lon("Moon")
        saturn_deg = get_lon("Saturn")
        jupiter_deg = get_lon("Jupiter")
        venus_deg = get_lon("Venus")
        mars_deg = get_lon("Mars")
        rahu_deg = get_lon("Rahu")
        ketu_deg = get_lon("Ketu")
        
        # Sign indices
        asc_sign = get_sign_index(asc_deg)
        moon_sign = get_sign_index(moon_deg)
        saturn_sign = get_sign_index(saturn_deg)
        
        # Determine 8th Lord
        eighth_sign = (asc_sign + 7) % 12
        # Lord mapping
        lord_mapping = {
            0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
            4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars",
            8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter"
        }
        asc_lord = lord_mapping[asc_sign]
        eighth_lord = lord_mapping[eighth_sign]
        
        asc_lord_deg = get_lon(asc_lord)
        eighth_lord_deg = get_lon(eighth_lord)
        
        asc_lord_sign = get_sign_index(asc_lord_deg)
        eighth_lord_sign = get_sign_index(eighth_lord_deg)
        
        # Calculate Hora Lagna
        sunrise_dt_local, _ = get_sunrise_sunset(payload.lat, payload.lon, dt_local.date(), payload.tz_offset)
        if dt_local < sunrise_dt_local:
            sunrise_dt_local, _ = get_sunrise_sunset(payload.lat, payload.lon, dt_local.date() - datetime.timedelta(days=1), payload.tz_offset)
            
        ishta_hours = (dt_local - sunrise_dt_local).total_seconds() / 3600.0
        jd_sunrise = datetime_to_julian(sunrise_dt_local - datetime.timedelta(hours=payload.tz_offset))
        sunrise_chart = build_rashi_chart(jd_sunrise, payload.lat, payload.lon)
        sun_data = sunrise_chart["planet_positions"]["Sun"]
        sun_deg_at_sunrise = sun_data["sidereal"]["lon"] if isinstance(sun_data, dict) else sun_data
        
        hora_deg = (sun_deg_at_sunrise + ishta_hours * 30.0) % 360
        hora_sign = get_sign_index(hora_deg)
        
        # JAIMINI PAIRS
        pair1_mod1 = get_sign_modality(asc_lord_sign)
        pair1_mod2 = get_sign_modality(eighth_lord_sign)
        result_pair1 = get_longevity_from_pair(pair1_mod1, pair1_mod2)
        
        pair2_mod1 = get_sign_modality(moon_sign)
        pair2_mod2 = get_sign_modality(saturn_sign)
        result_pair2 = get_longevity_from_pair(pair2_mod1, pair2_mod2)
        
        pair3_mod1 = get_sign_modality(asc_sign)
        pair3_mod2 = get_sign_modality(hora_sign)
        result_pair3 = get_longevity_from_pair(pair3_mod1, pair3_mod2)
        
        results = [result_pair1, result_pair2, result_pair3]
        counts = {"Alpayu": results.count("Alpayu"), "Madhyayu": results.count("Madhyayu"), "Purnayu": results.count("Purnayu")}
        
        # Determine base bracket
        base_bracket = "Unknown"
        for bracket, count in counts.items():
            if count >= 2:
                base_bracket = bracket
                break
                
        if base_bracket == "Unknown":
            base_bracket = result_pair3 # If all 3 differ, Lagna/Hora Lagna takes precedence in some variations.
            
        # Kakshya Vriddhi / Hrasa
        def get_house(lon_deg):
            if lon_deg is None: return None
            # Using Whole Sign
            sign_idx = int(lon_deg / 30) % 12
            return (sign_idx - asc_sign) % 12 + 1
            
        jupiter_house = get_house(jupiter_deg)
        saturn_house = get_house(saturn_deg)
        
        vriddhi = False
        hrasa = False
        vriddhi_reasons = []
        hrasa_reasons = []
        
        if jupiter_house in [1, 7]:
            vriddhi = True
            vriddhi_reasons.append("Jupiter in 1st or 7th house (Kakshya Vriddhi).")
            
        if saturn_house in [1, 7]:
            hrasa = True
            hrasa_reasons.append("Saturn in 1st or 7th house (Kakshya Hrasa).")
            
        final_bracket = base_bracket
        brackets_ordered = ["Alpayu", "Madhyayu", "Purnayu"]
        idx = brackets_ordered.index(base_bracket) if base_bracket in brackets_ordered else 1
        
        if vriddhi and not hrasa:
            idx = min(2, idx + 1)
            final_bracket = brackets_ordered[idx]
        elif hrasa and not vriddhi:
            idx = max(0, idx - 1)
            final_bracket = brackets_ordered[idx]
            
        # Balarishta (Child Mortality Yogas)
        moon_house = get_house(moon_deg)
        balarishta_warnings = []
        if moon_house in [6, 8, 12]:
            balarishta_warnings.append(f"Moon is placed in the {moon_house}th house (Dusthana).")
            
        # Check malefic aspects/conjunctions on Moon (simplistic conjunct check < 15 deg)
        def is_conjunct(p1_deg, p2_deg):
            if p1_deg is None or p2_deg is None: return False
            diff = abs(p1_deg - p2_deg)
            return min(diff, 360 - diff) < 15
            
        if is_conjunct(moon_deg, saturn_deg): balarishta_warnings.append("Moon is closely conjunct Saturn.")
        if is_conjunct(moon_deg, mars_deg): balarishta_warnings.append("Moon is closely conjunct Mars.")
        if is_conjunct(moon_deg, rahu_deg): balarishta_warnings.append("Moon is closely conjunct Rahu.")
        if is_conjunct(moon_deg, ketu_deg): balarishta_warnings.append("Moon is closely conjunct Ketu.")
        
        return {
            "jaimini_pairs": [
                {
                    "name": "Lagna Lord & 8th Lord",
                    "entities": f"{asc_lord} ({pair1_mod1}) & {eighth_lord} ({pair1_mod2})",
                    "result": result_pair1
                },
                {
                    "name": "Moon & Saturn",
                    "entities": f"Moon ({pair2_mod1}) & Saturn ({pair2_mod2})",
                    "result": result_pair2
                },
                {
                    "name": "Lagna & Hora Lagna",
                    "entities": f"Lagna ({pair3_mod1}) & HL ({pair3_mod2})",
                    "result": result_pair3
                }
            ],
            "base_bracket": base_bracket,
            "kakshya_vriddhi": vriddhi,
            "kakshya_hrasa": hrasa,
            "vriddhi_reasons": vriddhi_reasons,
            "hrasa_reasons": hrasa_reasons,
            "final_bracket": final_bracket,
            "balarishta": len(balarishta_warnings) > 0,
            "balarishta_warnings": balarishta_warnings
        }
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"[LONGEVITY ERROR] {error_trace}")
        raise HTTPException(status_code=500, detail=str(e) + "\n" + error_trace)

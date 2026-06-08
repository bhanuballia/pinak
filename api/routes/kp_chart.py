from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any, List
import datetime
import math

from astronomy.julian import datetime_to_julian
from astronomy.ascendant import get_house_cusps
from charts.rashi_chart import build_rashi_chart
from core.utils import ZODIAC_SIGNS, get_sign_index
from panchang.nakshatra import compute_nakshatra_from_lon, NAKSHATRAS

router = APIRouter()

# ---------------------------------------------------------
# KP ASTROLOGY CONSTANTS & MATHEMATICS
# ---------------------------------------------------------

KP_LORD_SEQUENCE = [
    "Ketu",
    "Venus",
    "Sun",
    "Moon",
    "Mars",
    "Rahu",
    "Jupiter",
    "Saturn",
    "Mercury"
]

DASHA_YEARS = {
    "Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7,
    "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17
}

SIGN_LORDS = [
    "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", 
    "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
]

TOTAL_YEARS = 120
NAKSHATRA_DEG = 13.333333333333

def get_kp_lords(longitude: float) -> Dict[str, str]:
    """Calculates Sign Lord, Star (Nakshatra) Lord, Sub Lord, and Sub-Sub Lord for a given degree."""
    
    # 1. Sign Lord
    sign_idx = get_sign_index(longitude)
    sign_lord = SIGN_LORDS[sign_idx]
    
    # 2. Star Lord (Nakshatra Lord)
    nak_info = compute_nakshatra_from_lon(longitude)
    nak_idx = nak_info["nakshatra_index"]
    star_lord = KP_LORD_SEQUENCE[nak_idx % 9]
    
    # 3. Sub Lord
    degrees_inside_nak = nak_info["degrees_completed"]
    start_lord_idx = nak_idx % 9
    
    sub_lord = ""
    sub_sub_lord = ""
    
    cumulative_deg = 0.0
    for i in range(9):
        current_lord_idx = (start_lord_idx + i) % 9
        lord = KP_LORD_SEQUENCE[current_lord_idx]
        portion = (DASHA_YEARS[lord] / TOTAL_YEARS) * NAKSHATRA_DEG
        
        if cumulative_deg + portion >= degrees_inside_nak:
            sub_lord = lord
            
            # 4. Sub-Sub Lord
            degrees_inside_sub = degrees_inside_nak - cumulative_deg
            ss_cumulative = 0.0
            
            for j in range(9):
                ss_lord_idx = (current_lord_idx + j) % 9
                ss_lord = KP_LORD_SEQUENCE[ss_lord_idx]
                ss_portion = (DASHA_YEARS[ss_lord] / TOTAL_YEARS) * portion
                
                if ss_cumulative + ss_portion >= degrees_inside_sub:
                    sub_sub_lord = ss_lord
                    break
                ss_cumulative += ss_portion
                
            break
            
        cumulative_deg += portion
        
    if not sub_lord: sub_lord = KP_LORD_SEQUENCE[-1]
    if not sub_sub_lord: sub_sub_lord = KP_LORD_SEQUENCE[-1]
    
    return {
        "sign_lord": sign_lord,
        "star_lord": star_lord,
        "sub_lord": sub_lord,
        "sub_sub_lord": sub_sub_lord,
        "nak_name": nak_info["nakshatra_name"]
    }

# ---------------------------------------------------------
# API ROUTE
# ---------------------------------------------------------

@router.post("/calculate")
def calculate_kp_chart(payload: Dict[str, Any] = Body(...)):
    try:
        date = payload.get("date") or payload.get("birth_date")
        time = payload.get("time") or payload.get("birth_time")
        lat = float(payload["lat"])
        lon = float(payload["lon"])
        tz_offset = float(payload.get("tz_offset", 0.0))
        
        y, m, d = [int(x) for x in date.split("-")]
        tp = [int(x) for x in time.split(":")]
        dt_local = datetime.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
        dt_utc = dt_local - datetime.timedelta(hours=tz_offset)
        jd_ut = datetime_to_julian(dt_utc)
        
        # 1. Get Placidus House Cusps
        # get_house_cusps returns {"cusps": [None, c1, c2 ... c12], ...}
        house_data = get_house_cusps(jd_ut, lat, lon, house_system="P")
        cusps = house_data["cusps"]
        
        # 2. Get Standard Rashi Chart for Planet positions
        chart = build_rashi_chart(jd_ut, lat, lon)
        planets_data = chart.get("planet_positions", {})
        
        # Build Planets Array
        kp_planets = []
        for p_name, p_data in planets_data.items():
            if p_name == "Ascendant": continue
            p_lon = p_data["sidereal"]["lon"]
            
            lords = get_kp_lords(p_lon)
            
            short_name = p_name[:2]
            if p_name in ["Sun", "Moon", "Mars"]:
                short_name = p_name[:2]
                
            kp_planets.append({
                "planet": p_name,
                "short_name": short_name,
                "longitude": p_lon,
                "sign_name": ZODIAC_SIGNS[get_sign_index(p_lon)],
                "nak_name": lords["nak_name"],
                "sign_lord": lords["sign_lord"],
                "star_lord": lords["star_lord"],
                "sub_lord": lords["sub_lord"],
                "sub_sub_lord": lords["sub_sub_lord"]
            })
            
        # Add Ascendant to planets list (often used in KP as a node)
        asc_lon = house_data["ascendant_deg"]
        asc_lords = get_kp_lords(asc_lon)
        kp_planets.append({
            "planet": "Ascendant",
            "short_name": "As",
            "longitude": asc_lon,
            "sign_name": ZODIAC_SIGNS[get_sign_index(asc_lon)],
            "nak_name": asc_lords["nak_name"],
            "sign_lord": asc_lords["sign_lord"],
            "star_lord": asc_lords["star_lord"],
            "sub_lord": asc_lords["sub_lord"],
            "sub_sub_lord": asc_lords["sub_sub_lord"]
        })

        # Add Uranus, Neptune, Pluto
        import swisseph as swe
        from astronomy.positions import get_sidereal_position
        for p_name, pid in [("Uranus", swe.URANUS), ("Neptune", swe.NEPTUNE), ("Pluto", swe.PLUTO)]:
            try:
                p_data = get_sidereal_position(jd_ut, pid)
                p_lon = p_data["lon"]
                lords = get_kp_lords(p_lon)
                kp_planets.append({
                    "planet": p_name,
                    "short_name": p_name[:2],
                    "longitude": p_lon,
                    "sign_name": ZODIAC_SIGNS[get_sign_index(p_lon)],
                    "nak_name": lords["nak_name"],
                    "sign_lord": lords["sign_lord"],
                    "star_lord": lords["star_lord"],
                    "sub_lord": lords["sub_lord"],
                    "sub_sub_lord": lords["sub_sub_lord"]
                })
            except Exception as e:
                print(f"[API WARN] Failed to add outer planet {p_name} to KP chart: {e}")

        # Build Cusps Array
        kp_cusps = []
        for i in range(1, 13):
            c_lon = cusps[i]
            lords = get_kp_lords(c_lon)
            kp_cusps.append({
                "house": i,
                "longitude": c_lon,
                "sign_name": ZODIAC_SIGNS[get_sign_index(c_lon)],
                "nak_name": lords["nak_name"],
                "sign_lord": lords["sign_lord"],
                "star_lord": lords["star_lord"],
                "sub_lord": lords["sub_lord"],
                "sub_sub_lord": lords["sub_sub_lord"]
            })
            
        # Determine KP Significators (Simplified Occupants and Owners logic)
        # In KP, a planet occupies a house if its longitude falls between the cusp and the next cusp
        def get_house_of_planet(plon):
            for i in range(1, 13):
                curr = cusps[i]
                nxt = cusps[1] if i == 12 else cusps[i+1]
                if curr < nxt:
                    if curr <= plon < nxt: return i
                else:
                    if plon >= curr or plon < nxt: return i
            return 1
            
        occupants_map = {i: [] for i in range(1, 13)}
        owners_map = {i: kp_cusps[i-1]["sign_lord"] for i in range(1, 13)}
        
        for p in kp_planets:
            if p["planet"] == "Ascendant": continue
            h = get_house_of_planet(p["longitude"])
            occupants_map[h].append(p["short_name"])
            
        # 3. Calculate Significators
        # A (Very Strong): Planets in star of occupants
        # B (Strong): Occupants
        # C (Normal): Planets in star of cusp sign lord
        # D (Weak): Cusp sign lord
        significators = {}
        for h in range(1, 13):
            D = owners_map[h]
            B_names = [p for p in occupants_map[h]]
            B_full = [p["planet"] for p in kp_planets if p["short_name"] in B_names]
            
            A = []
            for occ in B_full:
                for p in kp_planets:
                    if p["star_lord"] == occ and p["planet"] not in A:
                        A.append(p["planet"])
                        
            C = []
            for p in kp_planets:
                if p["star_lord"] == D and p["planet"] not in C:
                    C.append(p["planet"])
                    
            significators[h] = {
                "A": A,
                "B": B_full,
                "C": C,
                "D": [D]
            }
            
        planet_significators = {}
        for p in kp_planets:
            p_name = p["planet"]
            if p_name == "Ascendant": continue
            p_A = [h for h in range(1, 13) if p_name in significators[h]["A"]]
            p_B = [h for h in range(1, 13) if p_name in significators[h]["B"]]
            p_C = [h for h in range(1, 13) if p_name in significators[h]["C"]]
            p_D = [h for h in range(1, 13) if p_name in significators[h]["D"]]
            planet_significators[p_name] = {
                "A": p_A,
                "B": p_B,
                "C": p_C,
                "D": p_D
            }
            
        # 4. Ruling Planets
        day_of_week = dt_local.weekday() # 0 = Monday, 6 = Sunday
        day_lords = ["Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Sun"]
        day_lord = day_lords[day_of_week]
        
        asc = next((p for p in kp_planets if p["planet"] == "Ascendant"), None)
        moon = next((p for p in kp_planets if p["planet"] == "Moon"), None)
        sun = next((p for p in kp_planets if p["planet"] == "Sun"), None)
        
        ruling_planets = {
            "day_lord": day_lord,
            "lagna_lord": asc["sign_lord"] if asc else "",
            "lagna_nak_lord": asc["star_lord"] if asc else "",
            "lagna_sub_lord": asc["sub_lord"] if asc else "",
            "moon_rashi_lord": moon["sign_lord"] if moon else "",
            "moon_nak_lord": moon["star_lord"] if moon else "",
            "moon_sub_lord": moon["sub_lord"] if moon else ""
        }
        
        # Fortuna (Ascendant + Moon - Sun)
        fortuna = 0
        if asc and moon and sun:
            fortuna = (asc["longitude"] + moon["longitude"] - sun["longitude"]) % 360
            
        # KP Ayanamsha
        import swisseph as swe
        swe.set_sid_mode(swe.SIDM_KRISHNAMURTI)
        ayanamsha = swe.get_ayanamsa_ut(jd_ut)
        swe.set_sid_mode(swe.SIDM_LAHIRI) # reset
        
        # Compile response
        return {
            "planets": kp_planets,
            "cusps": kp_cusps,
            "occupants": occupants_map,
            "owners": owners_map,
            "significators": significators,
            "planet_significators": planet_significators,
            "ruling_planets": ruling_planets,
            "fortuna": fortuna,
            "ayanamsha": ayanamsha
        }
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

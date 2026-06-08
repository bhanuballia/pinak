from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any, List
import datetime
from astronomy.julian import datetime_to_julian
from charts.rashi_chart import build_rashi_chart
from core.utils import ZODIAC_SIGNS, get_sign_index
from panchang.nakshatra import compute_nakshatra_from_lon

router = APIRouter()

def get_navamsha_index(absolute_degree: float) -> int:
    """Returns the absolute Navamsha index (0 to 107) for a given degree."""
    return int(absolute_degree / (360 / 108))

def calculate_navamsha_sign(absolute_degree: float) -> int:
    """Returns the sign index (0-11) of the Navamsha."""
    sign_idx = get_sign_index(absolute_degree)
    rem = absolute_degree % 30
    nav_in_sign = int(rem / (30 / 9)) # 0 to 8
    
    # Navamsha mapping rules based on element of the sign
    # Fire (0, 4, 8) start at Aries (0)
    # Earth (1, 5, 9) start at Capricorn (9)
    # Air (2, 6, 10) start at Libra (6)
    # Water (3, 7, 11) start at Cancer (3)
    elements_start = [0, 9, 6, 3]
    start_sign = elements_start[sign_idx % 4]
    
    return (start_sign + nav_in_sign) % 12

@router.post("/calculate")
def calculate_navamsha_ages(payload: Dict[str, Any] = Body(...)):
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
        
        chart = build_rashi_chart(jd_ut, lat, lon)
        
        asc_lon = chart["ascendant_deg"]
        asc_abs_nav_idx = get_navamsha_index(asc_lon)
        
        planets = []
        
        # Add Ascendant
        planets.append({
            "planet": "As",
            "absolute_degree": asc_lon,
            "sign_idx": get_sign_index(asc_lon),
            "nav_idx_in_sign": int((asc_lon % 30) / (30 / 9)),
            "rc": ""
        })
        
        # Add Planets
        for p_name, data in chart.get("planet_positions", {}).items():
            if p_name == "Ascendant": continue
            lon = data["sidereal"]["lon"]
            speed = data["sidereal"].get("speed_lon", 0)
            
            display_name = p_name[:2]
            if p_name in ["Sun", "Moon", "Mars"]:
                display_name = p_name[:2] # Su, Mo, Ma, Me, Ju, Ve, Sa, Ra, Ke
                
            planets.append({
                "planet": display_name,
                "absolute_degree": lon,
                "sign_idx": get_sign_index(lon),
                "nav_idx_in_sign": int((lon % 30) / (30 / 9)),
                "rc": "R" if speed < 0 else ""
            })
            
        # Build the 12 signs grid data
        grid = {}
        for sign_idx in range(12):
            sign_name = ZODIAC_SIGNS[sign_idx][:3]
            navamshas = []
            
            for nav_i in range(9):
                nav_start_deg = (sign_idx * 30) + (nav_i * (30 / 9))
                nav_mid_deg = nav_start_deg + (30 / 18) # Midpoint for Nakshatra lookup
                
                nak_info = compute_nakshatra_from_lon(nav_mid_deg)
                nav_sign_num = calculate_navamsha_sign(nav_mid_deg) + 1 # 1-12
                
                abs_nav_idx = get_navamsha_index(nav_mid_deg)
                
                # Age calculation: Ascendant navamsha = Age 1
                age = abs_nav_idx - asc_abs_nav_idx + 1
                if age <= 0:
                    age += 108
                
                # Find planets in this exact navamsha slot
                slot_planets = [p for p in planets if p["sign_idx"] == sign_idx and p["nav_idx_in_sign"] == nav_i]
                
                navamshas.append({
                    "nak_abbrev": nak_info["nakshatra_name"][:3],
                    "pada": nak_info["pada"],
                    "r_num": f"R{nav_sign_num}",
                    "age": age,
                    "planets": slot_planets
                })
                
            grid[sign_idx] = {
                "sign_name": sign_name,
                "navamshas": navamshas
            }
            
        return {"grid": grid}
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

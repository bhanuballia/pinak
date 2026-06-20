from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
import datetime
from astronomy.julian import datetime_to_julian
from charts.rashi_chart import build_rashi_chart
from dasha.vimshottari import compute_vimshottari_full, VIM_ORDER, VIM_DUR
from core.analysis.shadbala_engine import compute_shadbala
from ashtakavarga.classical import compute_ashtakavarga_classical
from charts.divisional import build_varga_chart
from charts.divisional.d10 import build_d10_chart
from core.analysis.vimsopaka_pro_engine import run_vimsopaka_assessment

router = APIRouter()

def get_active_dasha(birth_jd: float, moon_lon: float, target_jd: float) -> str:
    dashas = compute_vimshottari_full(birth_jd, moon_lon, years_ahead=120.0)
    
    active_maha = None
    active_antar = None
    active_pratyantar = None
    
    for maha in dashas:
        if maha["start_jd"] <= target_jd < maha["end_jd"]:
            active_maha = maha["lord"]
            for antar in maha["antardashas"]:
                if antar["start_jd"] <= target_jd < antar["end_jd"]:
                    active_antar = antar["lord"]
                    
                    # Calculate pratyantardasha manually
                    pt_start = antar["start_jd"]
                    antar_dur = antar["duration_years"]
                    start_idx = VIM_ORDER.index(active_antar)
                    for i in range(9):
                        pt_lord = VIM_ORDER[(start_idx + i) % 9]
                        pt_frac = VIM_DUR[pt_lord] / 120.0
                        pt_dur = antar_dur * pt_frac
                        pt_end = pt_start + pt_dur * 365.2425
                        if pt_start <= target_jd < pt_end:
                            active_pratyantar = pt_lord
                            break
                        pt_start = pt_end
                    break
            break
            
    if not active_maha:
        return "Unknown"
        
    return f"{active_maha} - {active_antar} - {active_pratyantar}"

@router.post("/time_machine")
def transit_time_machine(payload: Dict[str, Any] = Body(...)):
    try:
        b_date = payload["birth_date"]
        b_time = payload["birth_time"]
        b_lat = float(payload["lat"])
        b_lon = float(payload["lon"])
        b_tz = float(payload.get("tz_offset", 0.0))
        
        t_date = payload["transit_date"]
        t_time = payload.get("transit_time", "12:00:00")
        
        # Birth JD
        by, bm, bd = [int(x) for x in b_date.split("-")]
        btp = [int(x) for x in b_time.split(":")]
        b_dt_local = datetime.datetime(by, bm, bd, btp[0], btp[1], btp[2] if len(btp) > 2 else 0)
        b_dt_utc = b_dt_local - datetime.timedelta(hours=b_tz)
        b_jd_ut = datetime_to_julian(b_dt_utc)
        
        # Transit JD
        ty, tm, td = [int(x) for x in t_date.split("-")]
        ttp = [int(x) for x in t_time.split(":")]
        t_dt_local = datetime.datetime(ty, tm, td, ttp[0], ttp[1], ttp[2] if len(ttp) > 2 else 0)
        # Using birth tz offset for transit location since it's a simplification
        t_dt_utc = t_dt_local - datetime.timedelta(hours=b_tz)
        t_jd_ut = datetime_to_julian(t_dt_utc)
        
        # We only need transit houses and planets
        transit_chart = build_rashi_chart(t_jd_ut, b_lat, b_lon)
        birth_chart = build_rashi_chart(b_jd_ut, b_lat, b_lon)
        
        moon_lon = birth_chart["planet_positions"]["Moon"]["sidereal"]["lon"]
        dasha_string = get_active_dasha(b_jd_ut, moon_lon, t_jd_ut)
        
        varga_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 16, 20, 24, 27, 30, 40, 45, 60]
        b_vargas = {}
        b_vargas["d10"] = build_d10_chart(b_jd_ut, b_lat, b_lon, house_system="W", style="north")
        for d in varga_list:
            b_vargas[f"d{d}"] = build_varga_chart(
                d, b_jd_ut, b_lat, b_lon, 
                house_system="W", style="north",
                planet_positions=birth_chart["planet_positions"]
            )
            
        birth_vimsopaka = run_vimsopaka_assessment(b_vargas, birth_chart, {})
        
        return {
            "transit_houses": transit_chart.get("houses", {}),
            "transit_planets": transit_chart.get("planet_positions", {}),
            "birth_houses": birth_chart.get("houses", {}),
            "birth_planets": birth_chart.get("planet_positions", {}),
            "active_dasha": dasha_string,
            "transit_shadbala": compute_shadbala(transit_chart),
            "birth_shadbala": compute_shadbala(birth_chart),
            "birth_av": compute_ashtakavarga_classical(b_jd_ut, b_lat, b_lon),
            "birth_vimsopaka": birth_vimsopaka
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

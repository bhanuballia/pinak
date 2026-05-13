# api/routes/sadesati.py

from fastapi import APIRouter, Body, HTTPException
from typing import Dict, Any
import datetime
from astrology.moon import calculate_moon_sign
from astrology.saturn_transit import get_current_saturn_position
from astrology.sade_sati import calculate_sade_sati_phase, check_degree_peak
from astrology.panoti import detect_small_panoti
from astrology.scoring import calculate_risk_score, get_risk_interpretation
from astrology.remedies import get_sade_sati_remedies
from astronomy.julian import datetime_to_julian
from astronomy.positions import get_all_planetary_positions
from charts.rashi_chart import build_rashi_chart
from utils.location_resolver import safe_search_city

router = APIRouter()

@router.post("")
async def get_sade_sati_report(payload: Dict = Body(...)):
    try:
        date_str = payload.get("date")
        time_str = payload.get("time")
        place = payload.get("place")
        
        if not all([date_str, time_str, place]):
            raise HTTPException(status_code=400, detail="Missing birth data (date, time, place)")

        # 1. Resolve Location
        loc_res = safe_search_city(place, limit=1)
        if not loc_res:
            raise HTTPException(status_code=400, detail="Place not found")
        
        lat = loc_res[0]["lat"]
        lon = loc_res[0]["lon"]
        tz_offset = loc_res[0].get("tz_offset_hours", 5.5) # Default to IST if not found

        # 2. Compute Natal JD
        if "-" in date_str:
            y, m, d = [int(x) for x in date_str.split("-")]
        elif "/" in date_str:
            d, m, y = [int(x) for x in date_str.split("/")] # Assume DD/MM/YYYY
        else:
            raise ValueError("Unsupported date format")

        tp = [int(x) for x in time_str.split(":")]
        dt_local = datetime.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
        dt_utc = dt_local - datetime.timedelta(hours=tz_offset)
        jd_natal = datetime_to_julian(dt_utc)

        # 3. Get Natal Positions
        natal_positions = get_all_planetary_positions(jd_natal)
        moon_pos = natal_positions.get("Moon")
        if not moon_pos:
            raise HTTPException(status_code=500, detail="Failed to calculate Moon position")
        
        natal_moon_lon = moon_pos["sidereal"]["lon"]
        natal_moon_sign = int(natal_moon_lon / 30)
        natal_moon_deg = natal_moon_lon % 30

        # 4. Get Current Saturn Position
        now_utc = datetime.datetime.now(datetime.timezone.utc)
        jd_now = datetime_to_julian(now_utc)
        current_saturn = get_current_saturn_position(jd_now)
        
        if not current_saturn:
            raise HTTPException(status_code=500, detail="Failed to calculate Current Saturn position")

        # 5. Detect Sade Sati & Panoti
        current_phase = calculate_sade_sati_phase(natal_moon_sign, current_saturn["sign_index"])
        panoti_data = detect_small_panoti(natal_moon_sign, current_saturn["sign_index"])
        peak_trigger = check_degree_peak(natal_moon_deg, current_saturn["degree"])

        # 6. Risk Scoring (Simplified logic for now, using 15 for average strength)
        risk_score = calculate_risk_score(
            saturn_strength=15, 
            moon_weakness=15, 
            transit_overlap=(current_phase == "Peak")
        )
        risk_level = get_risk_interpretation(risk_score)

        # 7. Comprehensive Timeline Generation (3 Major Life Cycles)
        all_cycles = []
        ref_year = 2023.04
        ref_sign = 10 # Aquarius
        birth_year = dt_local.year
        
        s12 = (natal_moon_sign - 1 + 12) % 12
        
        # Find first cycle start relative to birth
        first_cycle_start = ref_year + (s12 - ref_sign) * 2.458
        while first_cycle_start > birth_year + 5: first_cycle_start -= 29.5
        while first_cycle_start < birth_year - 15: first_cycle_start += 29.5

        for cycle_num in range(1, 4):
            cycle_base = first_cycle_start + (cycle_num - 1) * 29.5
            phases = []
            for i, p_name in enumerate(["Rising", "Peak", "Setting"]):
                p_start = cycle_base + i * 2.458
                phases.append({
                    "phase": p_name,
                    "start": int(p_start),
                    "end": int(p_start + 2.5),
                    "age": int(p_start - birth_year)
                })
            all_cycles.append({
                "cycle": cycle_num,
                "phases": phases,
                "summary": f"{int(phases[0]['start'])} — {int(phases[2]['end'])}"
            })

        return {
            "currentPhase": current_phase,
            "riskScore": risk_score,
            "riskLevel": risk_level,
            "peakTrigger": peak_trigger,
            "ashtamaShani": panoti_data["ashtama_shani"],
            "ardhaAshtama": panoti_data["ardha_ashtama"],
            "kantakaShani": panoti_data["kantaka_shani"],
            "remedies": get_sade_sati_remedies(),
            "allCycles": all_cycles,
            "natalMoonSign": natal_moon_sign,
            "currentSaturnSign": current_saturn["sign_index"]
        }

    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"[SADESATI ERROR] {error_trace}")
        raise HTTPException(status_code=500, detail=str(e))

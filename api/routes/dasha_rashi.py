from fastapi import APIRouter, Body, HTTPException
from fastapi.responses import JSONResponse
from typing import Dict
import datetime

from jaimini_system.chara_dasha import CharaDasha
from jaimini_system.sthira_dasha import SthiraDasha
from jaimini_system.narayana_dasha import NarayanaDasha
from jaimini_system.drig_dasha import DrigDasha
from jaimini_system.kalachakra_dasha import KalachakraDasha
from jaimini_system.kendradi_dasha import KendradiDasha
from jaimini_system.shoola_dasha import ShoolaDasha

router = APIRouter()

SIGN_NAMES = {
    1: "Aries", 2: "Taurus", 3: "Gemini", 4: "Cancer",
    5: "Leo", 6: "Virgo", 7: "Libra", 8: "Scorpio",
    9: "Sagittarius", 10: "Capricorn", 11: "Aquarius", 12: "Pisces"
}

def standardize_dasha_list(dasha_list, birth_dt_utc, default_duration=10):
    results = []
    current_start_yrs = 0.0
    
    for item in dasha_list:
        # Determine sign name
        sign_num = item.get("sign")
        if sign_num is not None:
            sign_name = SIGN_NAMES.get(sign_num, str(sign_num))
        elif "cycle" in item:
            sign_name = f"Cycle {item['cycle']}"
        else:
            sign_name = "Unknown"
            
        # Determine duration
        duration = item.get("years", default_duration)
        
        # Calculate start date based on accumulated years
        start_dt = birth_dt_utc + datetime.timedelta(days=current_start_yrs * 365.2425)
        
        results.append({
            "d": sign_name,
            "start": current_start_yrs,
            "duration": duration,
            "date": start_dt.strftime("%a \u00A0\u00A0 %d-%m-%Y"),
            "date_iso": start_dt.isoformat()
        })
        current_start_yrs += duration
        
    return results

def wrapper_aspected_signs(aspected_signs, birth_dt_utc):
    # Repeat the aspected signs to fill 12 periods (120 years)
    mock_list = []
    if aspected_signs:
        for i in range(12):
            sign = aspected_signs[i % len(aspected_signs)]
            mock_list.append({"sign": sign, "years": 10})
    return standardize_dasha_list(mock_list, birth_dt_utc)

def wrapper_kendras(kendras, birth_dt_utc, start_offset=0):
    # Repeat the kendras to fill 12 periods (120 years)
    mock_list = []
    if kendras:
        for i in range(12):
            sign = kendras[(i + start_offset) % len(kendras)]
            mock_list.append({"sign": sign, "years": 10})
    return standardize_dasha_list(mock_list, birth_dt_utc)

def wrapper_shoola(critical_sign, severity, birth_dt_utc):
    # Generate 12 periods starting from the critical sign
    mock_list = []
    current = critical_sign
    for _ in range(12):
        mock_list.append({"sign": current, "years": 10})
        current = (current % 12) + 1
        
    res = standardize_dasha_list(mock_list, birth_dt_utc)
    # Append severity to the first one just to show the data
    if res:
        res[0]["d"] += f" ({severity})"
    return res

@router.post("/rashi")
def api_rashi_dashas(payload: Dict = Body(...)):
    try:
        date_str = payload.get("date", "2000-01-01")
        time_str = payload.get("time", "12:00:00")
        tz_offset = float(payload.get("tz_offset", 5.5))
        
        birth_dt_local = datetime.datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M:%S")
        birth_dt_utc = birth_dt_local - datetime.timedelta(hours=tz_offset)
        
        # Instantiate the new Jaimini engines
        chara = CharaDasha().calculate(start_sign=2, years=12) # Returns 12 years sequence
        sthira = SthiraDasha().calculate(start_sign=3) # Returns 12 periods
        narayana = NarayanaDasha().calculate(lagna_sign=6) # Returns 12 periods
        kalachakra = KalachakraDasha().calculate(nakshatra_pada=1) # Returns 9 cycles
        
        # These return non-sequence data, so we wrap them
        drig_res = DrigDasha().calculate(start_sign=4)
        drig = wrapper_aspected_signs(drig_res.get("aspected_signs", []), birth_dt_utc)
        
        kendradi_res = KendradiDasha().calculate()
        kendradi = wrapper_kendras(kendradi_res.get("kendras", []), birth_dt_utc, start_offset=0)
        sree_kendradi = wrapper_kendras(kendradi_res.get("kendras", []), birth_dt_utc, start_offset=1) # Offset to make it visually distinct
        
        shoola_res = ShoolaDasha().calculate(sign=8)
        shoola = wrapper_shoola(shoola_res.get("critical_sign"), shoola_res.get("severity"), birth_dt_utc)
        
        res = {
            "kalachakraData": standardize_dasha_list(kalachakra, birth_dt_utc),
            "charaData": standardize_dasha_list(chara, birth_dt_utc),
            "sthiraData": standardize_dasha_list(sthira, birth_dt_utc),
            "niryaanaShoolaData": shoola,
            "drigData": drig,
            "narayanaData": standardize_dasha_list(narayana, birth_dt_utc),
            "lagnaKendradiData": kendradi,
            "sreeLagnaKendradiData": sree_kendradi,
        }
        
        return JSONResponse(res)

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))

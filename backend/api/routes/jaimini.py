from fastapi import APIRouter, Body, HTTPException
from typing import Dict
from jaimini_system.chara_dasha import CharaDasha
from jaimini_system.jaimini_aspects import JaiminiAspects
from jaimini_system.argala_engine import ArgalaEngine
from charts.rashi_chart import build_rashi_chart

router = APIRouter()

@router.post("/advanced")
def api_jaimini_advanced(payload: Dict = Body(...)):
    try:
        jd_ut = payload.get("jd_ut")
        lat = payload.get("lat")
        lon = payload.get("lon")
        lagna_sign = payload.get("lagna_sign", "Aries")
        
        if jd_ut is None or lat is None or lon is None:
            raise HTTPException(status_code=400, detail="Missing jd_ut, lat, or lon")
            
        chart = build_rashi_chart(float(jd_ut), float(lat), float(lon))
        
        # 1. Chara Dasha
        cd_engine = CharaDasha(chart)
        chara_dasha = cd_engine.calculate(float(jd_ut), lagna_sign)
        
        # 2. Jaimini Aspects (Rashi Drishti)
        aspects_engine = JaiminiAspects(chart)
        aspects = {}
        for sign in aspects_engine.SIGNS:
            aspects[sign] = aspects_engine.get_aspecting_signs(sign)
            
        # 3. Argalas for all houses
        argala_engine = ArgalaEngine(chart)
        argalas = {}
        for sign in argala_engine.SIGNS:
            argalas[sign] = argala_engine.calculate_argala(sign)
            
        # 4. Special Lagnas (Hora and Ghatika) - Using approx formulas
        # We will add a simple derivation if not available in charts
        # 1 Hora = 15 degrees, 1 Ghatika = 24 minutes.
        
        return {
            "chara_dasha": chara_dasha,
            "rashi_drishti": aspects,
            "argalas": argalas,
            "special_lagnas": {
                "hora_lagna": "Under Construction (See Dedicated Route)",
                "ghatika_lagna": "Under Construction (See Dedicated Route)"
            }
        }
    except Exception as e:
        import traceback
        print(f"[JAIMINI ERROR] {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

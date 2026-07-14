from fastapi import APIRouter, Body, HTTPException
from typing import Dict
from core.longevity.ayurdaya_engine import AyurdayaEngine
from charts.rashi_chart import build_rashi_chart

router = APIRouter()

@router.post("/calculate")
def calculate_ayurdaya(payload: Dict = Body(...)):
    try:
        jd_ut = payload.get("jd_ut")
        lat = payload.get("lat")
        lon = payload.get("lon")
        
        if jd_ut is None or lat is None or lon is None:
            raise HTTPException(status_code=400, detail="Missing jd_ut, lat, or lon")
            
        chart = build_rashi_chart(float(jd_ut), float(lat), float(lon))
        engine = AyurdayaEngine(chart)
        report = engine.generate_report()
        
        return report
    except Exception as e:
        import traceback
        print(f"[AYURDAYA ERROR] {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

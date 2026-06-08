# api/routes/ashtakavarga.py
from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
import datetime

from astronomy.julian import datetime_to_julian
from charts.rashi_chart import build_rashi_chart
from core.utils import get_sign_index

# Ashtakavarga imports
from ashtakavarga import (
    Bhinnashtakavarga,
    SamudayaAshtakavarga,
    SodhyaPinda,
    AshtakavargaVisualizer,
    HouseStrength,
    AshtakavargaAI
)

router = APIRouter()

@router.post("")
def get_ashtakavarga(payload: Dict[str, Any] = Body(...)):
    """
    Calculate full classical Ashtakavarga and return analytics.
    """
    try:
        date = payload["date"]
        time = payload["time"]
        tz_offset = float(payload.get("tz_offset", 0.0))
        lat = float(payload["lat"])
        lon = float(payload["lon"])
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing payload field: {e}")

    try:
        y, m, d = [int(x) for x in date.split("-")]
        tp = [int(x) for x in time.split(":")]
        dt_local = datetime.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
        dt_utc = dt_local - datetime.timedelta(hours=tz_offset)
        jd_ut = datetime_to_julian(dt_utc)
        
        rashi = build_rashi_chart(jd_ut, lat, lon)
        
        # Build simple chart map for AV: { "Sun": sign_index, ... }
        av_chart = {}
        for p_name, p_data in rashi["planet_positions"].items():
            if p_name in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]:
                av_chart[p_name] = get_sign_index(p_data["sidereal"]["lon"])
                
        # Add Ascendant to the chart for AV calculation
        av_chart["Ascendant"] = rashi["ascendant_sign_index"]
                
        # Run AV calculations
        bhinna_calc = Bhinnashtakavarga().calculate(av_chart)
        bhinna_sums = bhinna_calc["sums"]
        bhinna_breakdown = bhinna_calc["breakdown"]
        
        samudaya = SamudayaAshtakavarga().calculate(bhinna_sums)
        
        # Additional aggregations
        sodhya_pinda = SodhyaPinda().calculate(samudaya)
        visual_data = AshtakavargaVisualizer().prepare(samudaya)
        total_bindus = sum(samudaya.values())
        
        # House strength analytics
        # To map houses properly, we need the lagna sign
        lagna_sign_idx = rashi["ascendant_sign_index"]
        
        house_analytics = []
        for i in range(12):
            sign_idx = (lagna_sign_idx + i) % 12
            house_num = i + 1
            points = samudaya[sign_idx]
            
            house_analytics.append({
                "house": house_num,
                "sign_index": sign_idx,
                "sign": visual_data[sign_idx]["sign"],
                "points": points,
                "strength": HouseStrength().classify(points),
                "interpretation": AshtakavargaAI().interpret(house_num, points)
            })

        return {
            "bhinna": bhinna_sums,
            "bhinna_breakdown": bhinna_breakdown,
            "samudaya": samudaya,
            "sodhya_pinda": sodhya_pinda,
            "visual_data": visual_data,
            "house_analytics": house_analytics,
            "total_bindus": total_bindus
        }
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from reports.report_data import assemble_report_data
from matchmaking.guna_milan.nakshatra_data import NAKSHATRA_ATTRIBUTES, SIGN_ATTRIBUTES
from matchmaking.manglik.manglik_detection import check_manglik_dosha

router = APIRouter()

class BiodataRequest(BaseModel):
    birth_date: str # YYYY-MM-DD
    birth_time: str # HH:MM
    latitude: float
    longitude: float

class BiodataResponse(BaseModel):
    rashi: str
    nakshatra: str
    nakshatra_pada: int
    varna: str
    yoni: str
    gana: str
    nadi: str
    is_manglik: bool

@router.post("/astro-details", response_model=BiodataResponse)
async def get_astro_details(req: BiodataRequest):
    try:
        report = assemble_report_data(
            "User",
            req.birth_date,
            req.birth_time,
            5.5, # default tz
            req.latitude,
            req.longitude
        )
        
        moon_data = None
        for p in report.get("planet_positions", []):
            if p.get("planet") == "Moon":
                moon_data = p
                break
                
        if not moon_data:
            raise ValueError("Moon data not found in chart")

        rashi = moon_data.get('sign', 'Unknown')
        nakshatra = moon_data.get('nakshatra', 'Unknown')
        
        chart_data = report.get("chart", {})
        moon_chart = chart_data.get("planet_positions", {}).get("Moon", {})
        pada = moon_chart.get("nakshatra", {}).get("pada", 1)

        try:
            varna = SIGN_ATTRIBUTES.get(rashi, {}).get("varna", "Unknown")
        except:
            varna = "Unknown"
            
        try:
            yoni = NAKSHATRA_ATTRIBUTES.get(nakshatra, {}).get("yoni", "Unknown")
        except:
            yoni = "Unknown"
            
        try:
            gana = NAKSHATRA_ATTRIBUTES.get(nakshatra, {}).get("gana", "Unknown")
        except:
            gana = "Unknown"
            
        try:
            nadi = NAKSHATRA_ATTRIBUTES.get(nakshatra, {}).get("nadi", "Unknown")
        except:
            nadi = "Unknown"
            
        is_manglik = False
        try:
            manglik_res = check_manglik_dosha(chart_data)
            is_manglik = manglik_res.get('is_manglik', False)
        except:
            mars_house = 1
            for p in report.get("planet_positions", []):
                if p.get("planet") == "Mars":
                    mars_house = p.get("house", 1)
                    break
            if mars_house in [1, 2, 4, 7, 8, 12]:
                is_manglik = True

        return BiodataResponse(
            rashi=rashi,
            nakshatra=nakshatra,
            nakshatra_pada=pada,
            varna=varna,
            yoni=yoni,
            gana=gana,
            nadi=nadi,
            is_manglik=is_manglik
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# api/matchmaking_routes.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional

from reports.report_data import assemble_report_data
from matchmaking.marriage_engine import run_marriage_matching

router = APIRouter(prefix="/api/matchmaking", tags=["Matchmaking"])

class MatchmakingRequest(BaseModel):
    bride: Dict[str, Any] # {name, birth_date, birth_time, tz_offset, lat, lon}
    groom: Dict[str, Any]

class ActivationRequest(BaseModel):
    bride: Optional[Dict[str, Any]] = None
    groom: Optional[Dict[str, Any]] = None

import os
try:
    import google.generativeai as genai
    _HAS_GEMINI = True
except ImportError:
    _HAS_GEMINI = False

@router.post("")
async def get_matchmaking_report(request: MatchmakingRequest):
    try:
        # 1. Generate full report data for both
        bride_report = assemble_report_data(
            request.bride.get("name", "Bride"),
            request.bride["birth_date"],
            request.bride["birth_time"],
            float(request.bride.get("tz_offset", 5.5)),
            float(request.bride["lat"]),
            float(request.bride["lon"])
        )
        groom_report = assemble_report_data(
            request.groom.get("name", "Groom"),
            request.groom["birth_date"],
            request.groom["birth_time"],
            float(request.groom.get("tz_offset", 5.5)),
            float(request.groom["lat"]),
            float(request.groom["lon"])
        )
        
        # 2. Run Matchmaking Engine
        report = run_marriage_matching(bride_report, groom_report)
        
        return report
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/marriage-activation")
async def get_marriage_activation(request: ActivationRequest):
    try:
        if not _HAS_GEMINI or not os.getenv("GEMINI_API_KEY"):
            return {"analysis": "<div class='p-4 text-rose-500 font-bold'>AI Service not available or API key not set. Cannot perform COMPLETE MARRIAGE ACTIVATION ANALYSIS.</div>"}
            
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        if request.groom:
            person_data = request.groom
            gender = "Boy"
        else:
            person_data = request.bride
            gender = "Girl"
        
        person_report = assemble_report_data(
            person_data.get("name", gender),
            person_data["birth_date"],
            person_data["birth_time"],
            float(person_data.get("tz_offset", 5.5)),
            float(person_data["lat"]),
            float(person_data["lon"])
        )
        
        chart = person_report.get("chart", {})
        asc = chart.get("ascendant_sign", "Unknown")
        d1_planets = person_report.get("planet_positions", [])
        d1_context = [f"{p.get('planet')} in House {p.get('house')} ({p.get('sign')})" for p in d1_planets if isinstance(p, dict)]
        
        dasha_info = person_report.get("dasha", {}).get("current", {})
        dasha_str = dasha_info.get("lord", "Unknown") if isinstance(dasha_info, dict) else str(dasha_info)
        
        yogas = person_report.get("yogas", [])
        yogas_context = [y.get("name", "") for y in yogas if isinstance(y, dict)]
        
        prompt = f"""You are an expert Vedic Astrologer. Provide a COMPLETE MARRIAGE ACTIVATION ANALYSIS for the following birth details:
Date: {person_data["birth_date"]}, Time: {person_data["birth_time"]}, Name: {person_data.get("name", gender)}.

Astrological Data to base your analysis on:
- Ascendant: {asc}
- D1 Planets: {', '.join(d1_context)}
- Current Dasha: {dasha_str}
- Detected Yogas: {', '.join(yogas_context)}

(Note: Extrapolate Upapada, Darakaraka, and D9 analysis based on the provided D1 planetary positions).

Address these exact points:
1. Whether marriage yogas were strongly activated
2. Whether marriage likely occurred in past dashas
3. Possibility of prior serious relationships
4. Divorce/remarriage potential
5. Hidden relationship tendencies
6. Timing windows of marriage manifestation

Provide a detailed, readable, and structured response using HTML formatting (e.g. <h3>, <p>, <ul>, <li>, <strong>) so it can be rendered directly in a frontend component. Make it sound professional, astrological, and insightful. 
CRITICAL REQUIREMENT: You MUST display each of the 6 exact question points as headings or bold text wrapped in <span style="color: red;">...</span> so they appear in red color.
No markdown, only raw HTML. Output only the HTML content."""

        response = model.generate_content(prompt)
        text = response.text.strip()
        
        if text.startswith("```html"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
            
        return {"analysis": text.strip()}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

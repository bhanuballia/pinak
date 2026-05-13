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

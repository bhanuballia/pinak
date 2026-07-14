from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from core.decision.cosmic_decision_engine import evaluate_decision
from reports.report_data import assemble_report_data

router = APIRouter()

class DecisionRequest(BaseModel):
    date: str
    time: str
    lat: float
    lon: float
    question: str
    year: int
    tz_offset: float = 5.5
    name: str = "User"

@router.post("/cosmic-decision")
def cosmic_decision(data: DecisionRequest):
    try:
        # Assemble minimal report data required for decision
        # Note: assemble_report_data might be heavy, but it ensures we have all engines running
        report_data = assemble_report_data(
            name=data.name,
            date=data.date,
            time=data.time,
            tz_offset=data.tz_offset,
            lat=data.lat,
            lon=data.lon
        )

        decision = evaluate_decision(
            question=data.question,
            year=data.year,
            chart=report_data.get("chart"),
            timeline=report_data.get("timeline", []),
            probability_matrix=report_data.get("probability_matrix", {}),
            karma_simulation=report_data.get("karma_simulation", {}),
            dosha=report_data.get("dosha", {}),
            strength=report_data.get("strength", {}),
        )

        return decision

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from core.oracle.oracle_core import oracle_query
from core.oracle_matrix.matrix_core import omniscient_oracle
from reports.report_data import assemble_report_data

router = APIRouter()

class OracleRequest(BaseModel):
    date: str
    time: str
    lat: float
    lon: float
    question: str
    tz_offset: float = 5.5
    name: str = "User"
    history: Optional[List[str]] = []

@router.post("/oracle")
def ask_oracle(data: OracleRequest):
    try:
        # Assemble minimal report data required for oracle
        report_data = assemble_report_data(
            name=data.name,
            date=data.date,
            time=data.time,
            tz_offset=data.tz_offset,
            lat=data.lat,
            lon=data.lon
        )

        # Use Omniscient Oracle Matrix for advanced reasoning
        result = omniscient_oracle(
            question=data.question,
            report_data=report_data,
            history=data.history
        )

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

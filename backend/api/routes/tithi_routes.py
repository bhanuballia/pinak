# api/routes/tithi_routes.py

from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

from tithi_pravesha.tithi_engine import TithiEngine

router = APIRouter()

class TithiRequest(BaseModel):
    date: str  # YYYY-MM-DD
    time: str  # HH:MM
    lat: float
    lon: float
    tz_offset: float
    target_year: Optional[int] = None

@router.post("/tithi-pravesha")
def get_tithi_pravesha(req: TithiRequest):
    
    # Parse natal datetime
    # We treat date and time as local time based on the tz_offset
    # Actually, we can just use the UT time to find Julian Day
    # Let's convert local to UT
    time_str = req.time
    if len(time_str.split(":")) == 3:
        local_dt = datetime.strptime(f"{req.date} {time_str}", "%Y-%m-%d %H:%M:%S")
    else:
        local_dt = datetime.strptime(f"{req.date} {time_str}", "%Y-%m-%d %H:%M")
    
    from datetime import timedelta
    ut_dt = local_dt - timedelta(hours=req.tz_offset)
    
    target = req.target_year or datetime.now().year
    
    engine = TithiEngine()
    result = engine.calculate_exact_tithi_pravesha(ut_dt, target, req.lat, req.lon)
    
    return result

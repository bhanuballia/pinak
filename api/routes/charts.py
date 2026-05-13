# api/routes/charts.py
"""
Chart generation endpoints: rashi and navamsa (D1, D9).
"""
from __future__ import annotations
from fastapi import APIRouter, Query, HTTPException
from typing import Optional
import datetime

from astronomy.julian import datetime_to_julian
from charts.rashi_chart import build_rashi_chart
from charts.navamsa_chart import build_navamsa_chart

router = APIRouter()

def _parse_dt(date: str, time: str) -> datetime.datetime:
    return datetime.datetime.fromisoformat(date + " " + time)

@router.get("/rashi")
def rashi(
    date: str = Query(...),
    time: str = Query("00:00:00"),
    tz_offset: float = Query(0.0),
    lat: float = Query(...),
    lon: float = Query(...),
    house_system: str = Query("W"),
    style: str = Query("north")
):
    try:
        dt = _parse_dt(date, time)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid date/time: {exc}")
    dt_utc = dt - datetime.timedelta(hours=float(tz_offset))
    jd = datetime_to_julian(dt_utc)
    chart = build_rashi_chart(jd, lat, lon, house_system=house_system, style=style)
    return chart

@router.get("/navamsa")
def navamsa(
    date: str = Query(...),
    time: str = Query("00:00:00"),
    tz_offset: float = Query(0.0),
    lat: float = Query(...),
    lon: float = Query(...),
    house_system: str = Query("W"),
    style: str = Query("north")
):
    try:
        dt = _parse_dt(date, time)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid date/time: {exc}")
    dt_utc = dt - datetime.timedelta(hours=float(tz_offset))
    jd = datetime_to_julian(dt_utc)
    chart = build_navamsa_chart(jd, lat, lon, house_system=house_system, style=style)
    return chart

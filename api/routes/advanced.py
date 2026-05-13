# api/routes/advanced.py
"""
Advanced endpoints for shadbala, ashtakavarga, matching, transit, yogas, remedies, prediction.
"""
from __future__ import annotations
from fastapi import APIRouter, Query, HTTPException
from typing import Optional
import datetime

from astronomy.julian import datetime_to_julian
from charts.rashi_chart import build_rashi_chart
from strength.shadbala import compute_shadbala
from ashtakavarga.ashtakavarga import compute_ashtakavarga
from matching.kundli import compute_guna_milan
from transit.transit import current_transits, upcoming_transit_windows
from yogas.yogas import detect_yogas
from remedies.remedies import suggest_remedies_for_yogas
from prediction.prediction import predict_simple

router = APIRouter()

def _parse_dt(date: str, time: str) -> datetime.datetime:
    return datetime.datetime.fromisoformat(date + " " + time)

@router.get("/shadbala")
def shadbala(
    date: str = Query(...),
    time: str = Query("00:00:00"),
    tz_offset: float = Query(0.0),
    lat: float = Query(...),
    lon: float = Query(...)
):
    try:
        dt = _parse_dt(date, time)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    dt_utc = dt - datetime.timedelta(hours=float(tz_offset))
    jd = datetime_to_julian(dt_utc)
    shad = compute_shadbala(jd, lat, lon)
    return shad

@router.get("/ashtakavarga")
def ashtakavarga(
    date: str = Query(...),
    time: str = Query("00:00:00"),
    tz_offset: float = Query(0.0),
    lat: float = Query(...),
    lon: float = Query(...)
):
    dt = _parse_dt(date, time)
    dt_utc = dt - datetime.timedelta(hours=float(tz_offset))
    jd = datetime_to_julian(dt_utc)
    av = compute_ashtakavarga(jd)
    return av

@router.get("/yogas")
def yogas(
    date: str = Query(...),
    time: str = Query("00:00:00"),
    tz_offset: float = Query(0.0),
):
    dt = _parse_dt(date, time)
    dt_utc = dt - datetime.timedelta(hours=float(tz_offset))
    jd = datetime_to_julian(dt_utc)
    y = detect_yogas(jd)
    return y

@router.get("/remedies")
def remedies(
    date: str = Query(...),
    time: str = Query("00:00:00"),
    tz_offset: float = Query(0.0),
):
    dt = _parse_dt(date, time)
    dt_utc = dt - datetime.timedelta(hours=float(tz_offset))
    jd = datetime_to_julian(dt_utc)
    y = detect_yogas(jd)
    r = suggest_remedies_for_yogas(y)
    return {"yogas": y, "remedies": r}

@router.get("/transit/current")
def transit_current(
    date: str = Query(...),
    time: str = Query("00:00:00"),
    tz_offset: float = Query(0.0),
    lat: float = Query(...),
    lon: float = Query(...),
    orb: float = Query(2.0)
):
    dt = _parse_dt(date, time)
    dt_utc = dt - datetime.timedelta(hours=float(tz_offset))
    jd = datetime_to_julian(dt_utc)
    # build natal chart from provided lat/lon/time -> used as natal in this endpoint
    natal = build_rashi_chart(jd, lat, lon, house_system="W")
    trans = current_transits(natal["planet_positions"], jd, orb=orb)
    return {"current_transits": trans}

@router.get("/predict")
def predict(
    birth_date: str = Query(...),
    birth_time: str = Query("00:00:00"),
    birth_tz: float = Query(0.0),
    birth_lat: float = Query(...),
    birth_lon: float = Query(...),
    now_date: Optional[str] = Query(None),
    now_time: Optional[str] = Query(None),
    now_tz: float = Query(0.0),
):
    # birth dt
    dt_birth = _parse_dt(birth_date, birth_time)
    dt_birth_utc = dt_birth - datetime.timedelta(hours=float(birth_tz))
    birth_jd = datetime_to_julian(dt_birth_utc)
    natal = build_rashi_chart(birth_jd, birth_lat, birth_lon, house_system="W")
    # now dt
    if now_date and now_time:
        dt_now = _parse_dt(now_date, now_time)
        dt_now_utc = dt_now - datetime.timedelta(hours=float(now_tz))
    else:
        dt_now_utc = datetime.datetime.utcnow()
    now_jd = datetime_to_julian(dt_now_utc)
    pred = predict_simple(natal, birth_jd, now_jd)
    return pred

# inside api/routes/advanced.py (add or replace function)
from ashtakavarga.classical import compute_ashtakavarga_classical

@router.get("/ashtakavarga/classical")
def ashtakavarga_classical(
    date: str = Query(...),
    time: str = Query("00:00:00"),
    tz_offset: float = Query(0.0),
    lat: float = Query(...),
    lon: float = Query(...),
    mode: str = Query("PV_NARASIMHA", description="Mode: BV_RAMAN | CS_PATEL | BPHS_SANthanam | PV_NARASIMHA | PARASHARA_LIGHT | CUSTOM_<NAME>")
):
    try:
        dt = _parse_dt(date, time)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    dt_utc = dt - datetime.timedelta(hours=float(tz_offset))
    jd = datetime_to_julian(dt_utc)
    result = compute_ashtakavarga_classical(jd, lat, lon, mode=mode)
    return result

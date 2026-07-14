# api/routes/reports.py
from __future__ import annotations
from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import FileResponse
from typing import Optional
import tempfile
import os

from reports.pdf_generator import generate_report_from_birth

router = APIRouter()

@router.post("/pdf", summary="Generate Kundali PDF report")
def create_report_pdf(
    payload: Dict = Body(..., description="JSON with birth details and style"),
):
    """
    Payload fields:
    - name (optional)
    - date: YYYY-MM-DD
    - time: HH:MM or HH:MM:SS
    - tz_offset: e.g. 5.5
    - lat: latitude (decimal)
    - lon: longitude (decimal)
    - style: "minimal" or "premium"
    """
    try:
        name = payload.get("name", "")
        date = payload["date"]
        time = payload["time"]
        tz_offset = float(payload.get("tz_offset", 0.0))
        lat = float(payload["lat"])
        lon = float(payload["lon"])
        style = payload.get("style", "minimal")
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing field: {e}")

    tmpdir = tempfile.mkdtemp(prefix="kundali_report_")
    outpath = os.path.join(tmpdir, f"kundali_{style}.pdf")
    generate_report_from_birth(date, time, tz_offset, lat, lon, style=style, language="english", output_path=outpath, name=name)
    # Stream file
    return FileResponse(outpath, filename=os.path.basename(outpath), media_type="application/pdf")

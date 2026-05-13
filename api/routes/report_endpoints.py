# api/routes/report_endpoints.py
from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import FileResponse
import tempfile, os
from reports.pdf_generator import generate_report_from_birth

router = APIRouter()

@router.post("/generate-report")
def generate_report(payload: dict = Body(...)):
    try:
        name = payload.get("name", "")
        date = payload["date"]
        time = payload["time"]
        tz_offset = float(payload.get("tz_offset", 0.0))
        lat = float(payload["lat"])
        lon = float(payload["lon"])
        style = payload.get("style", "minimal")
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing {e}")

    tmpdir = tempfile.mkdtemp()
    outpath = os.path.join(tmpdir, f"{name or 'kundali'}_{style}.pdf")
    generate_report_from_birth(date, time, tz_offset, lat, lon, style=style, language="english", output_path=outpath, name=name)
    return FileResponse(outpath, filename=os.path.basename(outpath), media_type="application/pdf")

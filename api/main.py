# api/main.py
"""
FastAPI application wiring for the Vedic Astrology App.

Exposes endpoints for Kundali, Panchang, Dasha, Ashtakavarga, and PDF report generation.
"""

from fastapi import FastAPI, HTTPException, Body
from fastapi.responses import FileResponse, JSONResponse
import tempfile, os
from typing import Dict, Any
from fastapi.middleware.cors import CORSMiddleware

# local imports
from charts.rashi_chart import build_rashi_chart
from panchang.tithi_yoga_karana import compute_tithi, compute_nakshatra, compute_yoga, compute_karana
from dasha.vimshottari import compute_vimshottari_full
from dasha.shodashottari import compute_shodashottari
from dasha.chaturshitisama import compute_chaturshitisama
from ashtakavarga.classical import compute_ashtakavarga_classical
from reports.pdf_generator import generate_report_from_birth
from reports.report_data import assemble_report_data
from utils.location_resolver import safe_search_city, list_timezones_with_offsets
from core.rishi.rishi_core import run_rishi_core
from core.oracle.oracle_api import router as oracle_router
from api.routes.astro import router as astro_router
from api.matchmaking_routes import router as matchmaking_router
from api.routes import decision
from api.routes import oracle
from api.routes import horoscope
from api.routes.profiles import router as profiles_router
from api.routes import lalkitab
from api.routes import conjunction
from api.routes import study
from api.routes import panchang
from api.routes import muhurt
from api.routes import career
from api.routes import finance
from api.routes import marriage
from api.routes import business
from api.routes import health
from api.routes import family_health
from api.routes import sadesati
from core.database import yantra_collection

app = FastAPI(title="Vedic Astrology API")

app.include_router(muhurt.router, prefix="/api/muhurt", tags=["Muhurt"])

@app.get("/api/yantras")
async def get_yantras():
    fallback_yantras = [
        {"name": "Sri Yantra", "significance": "Wealth, Prosperity & Spiritual Upliftment", "deity": "Mahalakshmi"},
        {"name": "Mahamrityunjay Yantra", "significance": "Health, Longevity & Protection from Diseases", "deity": "Lord Shiva"},
        {"name": "Kuber Yantra", "significance": "Financial Growth & Accumulation of Wealth", "deity": "Lord Kuber"},
        {"name": "Ganesh Yantra", "significance": "Removal of Obstacles & New Beginnings", "deity": "Lord Ganesha"},
        {"name": "Saraswati Yantra", "significance": "Education, Intelligence & Knowledge", "deity": "Goddess Saraswati"}
    ]
    try:
        yantras = []
        cursor = yantra_collection.find({})
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            yantras.append(doc)
        
        if not yantras:
            return fallback_yantras
            
        return yantras
    except Exception as e:
        print(f"[YANTRA ERROR] DB issue: {e}")
        return fallback_yantras

app.include_router(oracle_router, prefix="/api") # This seems to be the old one?
app.include_router(oracle.router, prefix="/api", tags=["Oracle"])
app.include_router(matchmaking_router)
app.include_router(astro_router, prefix="/api")
app.include_router(decision.router, prefix="/api", tags=["Decision"])
app.include_router(horoscope.router, prefix="/api/horoscope", tags=["Horoscope"])
app.include_router(profiles_router, prefix="/api/profiles", tags=["Profiles"])
app.include_router(lalkitab.router, prefix="/api/lalkitab", tags=["Lal Kitab"])
app.include_router(conjunction.router, prefix="/api/conjunction", tags=["Conjunction"])
app.include_router(study.router, prefix="/api/study", tags=["Study"])
app.include_router(career.router, prefix="/api/career", tags=["Career"])
app.include_router(panchang.router, prefix="/api/panchang", tags=["Panchang"])
app.include_router(finance.router, prefix="/api/finance", tags=["Finance"])
app.include_router(marriage.router, prefix="/api/marriage", tags=["Marriage"])
app.include_router(business.router, prefix="/api/business", tags=["Business"])
app.include_router(health.router, prefix="/api/health", tags=["Health"])
app.include_router(sadesati.router, prefix="/api/sade-sati", tags=["Sade Sati"])
app.include_router(family_health.router, prefix="/api/family-health", tags=["Family Health"])
TIMEZONE_CACHE = list_timezones_with_offsets()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def read_root():
    return {"message": "Vedic Astrology API is running"}


@app.get("/api/locations/search")
def api_search_locations(q: str):
    if not q:
        raise HTTPException(status_code=400, detail="q required")
    res = safe_search_city(q, limit=8)
    return JSONResponse(res)


@app.get("/api/timezones")
def api_timezones():
    return JSONResponse(TIMEZONE_CACHE)

@app.post("/api/kundali")
def api_kundali(payload: Dict = Body(...)):
    try:
        date = payload["date"]
        time = payload["time"]
        tz_offset = float(payload.get("tz_offset", 0.0))
        lat = float(payload["lat"])
        lon = float(payload["lon"])
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing {e}")

    # compute jd_ut
    from astronomy.julian import datetime_to_julian
    import datetime as _dt
    y, m, d = [int(x) for x in date.split("-")]
    tp = [int(x) for x in time.split(":")]
    dt_local = _dt.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
    dt_utc = dt_local - _dt.timedelta(hours=tz_offset)
    jd_ut = datetime_to_julian(dt_utc)

    chart = build_rashi_chart(jd_ut, lat, lon, house_system="W", style="north")
    chart["jd_ut"] = jd_ut
    return JSONResponse(chart)

@app.post("/api/panchang")
def api_panchang(payload: Dict = Body(...)):
    try:
        date = payload["date"]
        time = payload["time"]
        tz_offset = float(payload.get("tz_offset", 0.0))
        lat = float(payload["lat"])
        lon = float(payload["lon"])
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing {e}")
    from astronomy.julian import datetime_to_julian
    import datetime as _dt
    y, m, d = [int(x) for x in date.split("-")]
    tp = [int(x) for x in time.split(":")]
    dt_local = _dt.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
    dt_utc = dt_local - _dt.timedelta(hours=tz_offset)
    jd_ut = datetime_to_julian(dt_utc)
    tithi = compute_tithi(jd_ut)
    nak = compute_nakshatra(jd_ut)
    yoga = compute_yoga(jd_ut)
    karana = compute_karana(jd_ut)
    return {"tithi": tithi, "nakshatra": nak, "yoga": yoga, "karana": karana}

@app.post("/api/dasha/vimshottari")
def api_vimshottari(payload: Dict = Body(...)):
    try:
        jd_ut = float(payload["jd_ut"])
        moon_lon = float(payload["moon_lon"])
        years = float(payload.get("years", 120.0))
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing {e}")
    res = compute_vimshottari_full(jd_ut, moon_lon, years_ahead=years)
    return JSONResponse(res)

@app.post("/api/dasha/shodashottari")
def api_shodashottari(payload: Dict = Body(...)):
    try:
        start_planet = payload.get("start_planet", "Sun")
        years = float(payload.get("years", 116.0))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid parameter: {e}")
    res = compute_shodashottari(start_planet=start_planet, years_ahead=years)
    return JSONResponse(res)

@app.post("/api/dasha/chaturshitisama")
def api_chaturshitisama(payload: Dict = Body(...)):
    try:
        start_planet = payload.get("start_planet", "Sun")
        years = float(payload.get("years", 84.0))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid parameter: {e}")
    res = compute_chaturshitisama(start_planet=start_planet, years_ahead=years)
    return JSONResponse(res)

@app.post("/api/ashtakavarga")
def api_ashtakavarga(payload: Dict = Body(...)):
    try:
        jd_ut = float(payload["jd_ut"])
        lat = float(payload["lat"])
        lon = float(payload["lon"])
        mode = payload.get("mode", "PV_NARASIMHA")
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing {e}")
    res = compute_ashtakavarga_classical(jd_ut, lat, lon, mode=mode)
    return JSONResponse(res)

@app.post("/api/report/data")
def api_report_data(payload: Dict = Body(...)):
    try:
        try:
            name = payload.get("name", "")
            date = payload["date"]
            time = payload["time"]
            tz_offset = float(payload.get("tz_offset", 0.0))
            lat = float(payload["lat"])
            lon = float(payload["lon"])
            gender = payload.get("gender", "")
            location_name = payload.get("location_name", "")
        except KeyError as e:
            raise HTTPException(status_code=400, detail=f"Missing {e}")

        data = assemble_report_data(
            name=name,
            date=date,
            time=time,
            tz_offset=tz_offset,
            lat=lat,
            lon=lon,
            gender=gender,
            location_name=location_name,
        )

        data = run_rishi_core(data, payload.get("user_profile"))
        
        # Debug: Print d1_chart structure
        d1_chart = data.get("chart")
        if d1_chart:
            print("\n" + "="*80)
            print("[API DEBUG] d1_chart structure:")
            print(f"  - Has 'houses': {'houses' in d1_chart}")
            print(f"  - Has 'vargas': {'vargas' in data}")
            if 'vargas' in data and 'd9' in data['vargas']:
                d9_lagna = data['vargas']['d9'].get('ascendant_sign')
                print(f"  - D9 Lagna: {d9_lagna}")
        
        # Check strengths
        if 'strength' in data:
            print(f"  - Has 'strength' data")
            if 'planets' in data['strength']:
                sun_strength = data['strength']['planets'].get('Sun', {}).get('total')
                print(f"  - Sun total strength: {sun_strength}")
            if "houses" in d1_chart:
                houses = d1_chart["houses"]
                print(f"  - Houses count: {len(houses)}")
                keys_list = list(houses.keys())
                top_5 = [keys_list[i] for i in range(min(5, len(keys_list)))]
                print(f"  - House keys: {top_5}... (showing first 5)")
                for h in [1, 2, 3, 4, 5]:
                    hinfo = houses.get(h) or houses.get(str(h), {})
                    sign_name = hinfo.get("sign_name", "")
                    planets = hinfo.get("planets", [])
                    cusp_deg = hinfo.get("cusp_deg")
                    print(f"  - House {h}: sign_name='{sign_name}', planets={planets}, cusp_deg={cusp_deg}")
            print("="*80 + "\n")
        
        return JSONResponse(data)
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"[API ERROR] Report data assembly failed: {error_trace}")
        raise HTTPException(status_code=500, detail=f"Report data assembly failed: {str(e)}\n{error_trace}")



@app.post("/api/report/generate")
def api_generate_report(payload: Dict = Body(...)):
    try:
        try:
            name = payload.get("name", "")
            date = payload["date"]
            time = payload["time"]
            tz_offset = float(payload.get("tz_offset", 0.0))
            lat = float(payload["lat"])
            lon = float(payload["lon"])
            style = payload.get("style", "detailed")
            language = payload.get("language", "english")  # "english" | "hindi" | "bilingual"
            gender = payload.get("gender", "")
            location_name = payload.get("location_name", "")
        except KeyError as e:
            raise HTTPException(status_code=400, detail=f"Missing {e}")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
        
        tmpdir = tempfile.mkdtemp(prefix="kundali_")
        outpath = os.path.join(tmpdir, f"kundali_{style}.pdf")
        
        try:
            generate_report_from_birth(
                date,
                time,
                tz_offset,
                lat,
                lon,
                style=style,
                language=language,
                output_path=outpath,
                name=name,
                gender=gender,
                location_name=location_name,
                user_profile=payload.get("user_profile"),
            )
            if not os.path.exists(outpath):
                raise Exception("Report file was not created.")

            return FileResponse(
                outpath, 
                media_type="application/pdf", 
                filename=f"kundali_{name or 'report'}.pdf"
            )
        except Exception as e:
            import traceback
            error_trace = traceback.format_exc()
            print(f"[API ERROR] PDF generation failed: {error_trace}")
            raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}\n{error_trace}")
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"[API ERROR] Global error in api_generate_report: {error_trace}")
        raise HTTPException(status_code=500, detail=str(e))

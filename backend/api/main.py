# api/main.py
import os
from dotenv import load_dotenv
load_dotenv() # Load variables from .env file into the environment

import matplotlib
matplotlib.use('Agg')

print("[STARTUP] Initializing Vedic Astrology API...")
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
from dasha.ashtottari import compute_ashtottari
from dasha.dwadashottari import compute_dwadashottari
from dasha.shatabdika import compute_shatabdika
from dasha.dwisaptatisama import compute_dwisaptatisama
from dasha.panchottari import compute_panchottari
from dasha.yogini import compute_yogini_full
from ashtakavarga.classical import compute_ashtakavarga_classical
from reports.pdf_generator import generate_report_from_birth
from reports.report_data import assemble_report_data
from utils.location_resolver import safe_search_city, list_timezones_with_offsets
from core.rishi.rishi_core import run_rishi_core
from core.oracle.oracle_api import router as oracle_router
from api.routes import sanghatta_routes
from api.routes import medical_routes
from api.routes import dosha_routes
from api.routes import d108_routes
from api.routes import ayanamsha_routes
from api.routes import karaka_routes
from api.routes import tithi_routes
from api.routes.astro import router as astro_router
from api.matchmaking_routes import router as matchmaking_router
from matchmaking.websocket.websocket_server import router as websocket_router
from api.routes import decision
from api.routes import oracle
from api.routes import horoscope
from api.routes.profiles import router as profiles_router
from api.routes import lalkitab
from api.routes import conjunction
from api.routes import study
from api.routes import kalachakra
from api.routes import panchang
from api.routes import muhurt
from api.routes import career
from api.routes import finance
from api.routes import prashna
from api.routes import nadi
from api.routes import garga
from api.routes import mantra
from api.routes import numerology
from api.routes import astrology_comp
from api.routes import report
from api.routes import marriage
from api.routes import business
from api.routes import health
from api.routes import family_health
from api.routes import sadesati
from api.routes import panch_pakshi
from api.routes import shadbala
from api.routes import synastry
from api.routes import ashtakavarga
from api.routes import solar_return
from api.routes import nakshatra_advanced_live
from api.routes import transit_animated
from api.routes import navamsha_ages
from api.routes import transit
from api.routes import kp_chart
from api.routes import sunrise_chart
from api.routes import sarvatobhadra_routes
from api.routes import naming
from api.routes import longevity
from api.routes import astronomy
from api.routes import ai_interpretation
from api.routes import horoscope_reports
from api.routes import kota_routes
from api.routes import kurma_routes
from api.routes import chaitra_routes
from api.routes import jaimini
from api.routes import sudarshan_routes
from api.routes import btr
from api.routes import ayurdaya
from api.routes import biodata
from api.routes import vakri_routes
from api.routes import vastu
from api.routes import remedies_nakshatra
from core.database import yantra_collection

from api.routes.dasha_report import router as dasha_report_router
from api.routes.dasha_rashi import router as dasha_rashi_router
from api.routes.special_lagnas import router as special_lagnas_router
from jaimini_pro.api.jaimini_routes import router as jaimini_pro_router
from jaimini_pro.api.websocket_routes import router as websocket_router
from api.services.firebase_admin import initialize_firebase_admin
from api.services.cron_jobs import setup_cron_jobs
from contextlib import asynccontextmanager
from api.routers.face_reading import router as face_reading_router
from api.routers import palmistry


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    initialize_firebase_admin()
    setup_cron_jobs()
    yield
    # Shutdown (if needed)

app = FastAPI(
    title="Vedic Astrology API",
    description="Advanced API for generating Vedic astrology calculations and reports.",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(muhurt.router, prefix="/api/muhurt", tags=["Muhurt"])
app.include_router(dasha_report_router, prefix="/api", tags=["Dasha Engine"])
app.include_router(dasha_rashi_router, prefix="/api/dasha", tags=["dasha_rashi"])
app.include_router(special_lagnas_router, prefix="/api", tags=["Special Lagnas"])
app.include_router(jaimini_pro_router, prefix="/api", tags=["jaimini_pro"])
app.include_router(d108_routes.router, prefix="/api", tags=["d108"])
app.include_router(ayanamsha_routes.router, prefix="/api", tags=["ayanamsha"])
app.include_router(sanghatta_routes.router, prefix="/api", tags=["sanghatta"])
app.include_router(medical_routes.router, prefix="/api", tags=["medical"])
app.include_router(dosha_routes.router, prefix="/api", tags=["dosha"])
app.include_router(karaka_routes.router, prefix="/api", tags=["karaka"])
app.include_router(tithi_routes.router, prefix="/api", tags=["tithi"])
app.include_router(websocket_router, tags=["websocket"])
app.include_router(solar_return.router, prefix="/api/solar_return", tags=["Solar Return"])
app.include_router(ai_interpretation.router, prefix="/api/ai", tags=["AI"])
app.include_router(ai_interpretation.router, prefix="/api", tags=["AI"])
app.include_router(transit.router, prefix="/api/transit", tags=["Transit"])
app.include_router(vakri_routes.router, tags=["Vakri Explorer"])
app.include_router(vastu.router)
app.include_router(face_reading_router, prefix="/api", tags=["Face Reading"])
app.include_router(palmistry.router, prefix="/api/palmistry", tags=["Palmistry"])
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
app.include_router(websocket_router)
app.include_router(astro_router, prefix="/api")
app.include_router(decision.router, prefix="/api", tags=["Decision"])
app.include_router(horoscope.router, prefix="/api/horoscope", tags=["Horoscope"])
app.include_router(horoscope_reports.router, prefix="/api/horoscope-report", tags=["Horoscope Reports"])
app.include_router(profiles_router, prefix="/api/profiles", tags=["Profiles"])
app.include_router(lalkitab.router, prefix="/api/lalkitab", tags=["Lal Kitab"])
app.include_router(conjunction.router, prefix="/api/conjunction", tags=["Conjunction"])
app.include_router(study.router, prefix="/api/study", tags=["Study"])
app.include_router(career.router, prefix="/api/career", tags=["Career"])
app.include_router(panchang.router, prefix="/api/panchang", tags=["Panchang"])
app.include_router(prashna.router, prefix="/api/prashna", tags=["Prashna Kundali"])
app.include_router(finance.router, prefix="/api/finance", tags=["Finance"])
app.include_router(nadi.router, prefix="/api/nadi", tags=["Nadi Astrology"])
app.include_router(garga.router, prefix="/api/prediction", tags=["Garga Sutras"])
app.include_router(mantra.router, prefix="/api/mantra", tags=["Mantra Tracker"])
app.include_router(synastry.router, prefix="/api/synastry", tags=["Synastry Matrix"])
app.include_router(marriage.router, prefix="/api/marriage", tags=["Marriage"])
app.include_router(business.router, prefix="/api/business", tags=["Business"])
app.include_router(health.router, prefix="/api/health", tags=["Health"])
app.include_router(sadesati.router, prefix="/api/sade-sati", tags=["Sade Sati"])
app.include_router(panch_pakshi.router, prefix="/api/panch-pakshi", tags=["Panch Pakshi"])
app.include_router(shadbala.router, prefix="/api/shadbala", tags=["Shadbala"])
app.include_router(numerology.router)
app.include_router(astrology_comp.router)
app.include_router(report.router)
app.include_router(ashtakavarga.router, prefix="/api/ashtakavarga", tags=["Ashtakavarga"])
app.include_router(solar_return.router, prefix="/api/solar_return", tags=["Solar Return"])
app.include_router(nakshatra_advanced_live.router, prefix="/api/nakshatra_advanced", tags=["Advanced Nakshatra"])
app.include_router(remedies_nakshatra.router, prefix="/api/remedies", tags=["Nakshatra Remedies"])
app.include_router(transit_animated.router, prefix="/api/transit", tags=["Transits"])
app.include_router(navamsha_ages.router, prefix="/api/navamsha_ages", tags=["Navamsha Ages"])
app.include_router(kp_chart.router, prefix="/api/kp", tags=["KP Chart"])
app.include_router(sunrise_chart.router, prefix="/api/sunrise", tags=["Sunrise Chart"])
app.include_router(sarvatobhadra_routes.router, prefix="/api/sarvatobhadra", tags=["Sarvatobhadra"])
app.include_router(kalachakra.router, prefix="/api/kalachakra", tags=["Kalachakra"])
app.include_router(naming.router, prefix="/api/naming", tags=["Naming"])
app.include_router(longevity.router, prefix="/api/longevity", tags=["Longevity"])
app.include_router(astronomy.router, prefix="/api/astronomy", tags=["Astronomy"])
app.include_router(kota_routes.router, prefix="/api", tags=["Kota Chakra"])
app.include_router(kurma_routes.router, prefix="/api", tags=["Kurma Chakra"])
app.include_router(sudarshan_routes.router, prefix="/api", tags=["Sudarshan Chakra"])
app.include_router(chaitra_routes.router, prefix="/api", tags=["Chaitra Chart"])
app.include_router(jaimini.router, prefix="/api/jaimini_advanced", tags=["Advanced Jaimini"])
app.include_router(btr.router, prefix="/api/btr", tags=["BTR Wizard"])
app.include_router(ayurdaya.router, prefix="/api/ayurdaya", tags=["ayurdaya"])

from fastapi import WebSocket, WebSocketDisconnect
@app.websocket("/ws")
async def root_websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            import asyncio, json
            payload = json.dumps({"event": "Transiting Jupiter in Leo aspecting D108 Lagna", "type": "activation"})
            await websocket.send_text(payload)
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        pass
app.include_router(biodata.router, prefix="/api/biodata", tags=["biodata"])
print("[STARTUP] Initializing routers...")
app.include_router(family_health.router, prefix="/api/family-health", tags=["Family Health"])
print("[STARTUP] Computing timezone cache...")
TIMEZONE_CACHE = list_timezones_with_offsets()
print(f"[STARTUP] Timezone cache ready with {len(TIMEZONE_CACHE)} entries.")

print("[STARTUP] Warming up TimezoneFinder (this takes a few seconds)...")
from utils.location_resolver import get_tzf
get_tzf()
print("[STARTUP] TimezoneFinder warmed up successfully!")

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

from dasha.wealth_activation import compute_wealth_activation_timeline, derive_house_lords

@app.post("/api/dasha/wealth-activation")
def api_wealth_activation(payload: Dict = Body(...)):
    try:
        jd_ut = float(payload.get("jd_ut", 0))
        moon_lon = float(payload.get("moon_lon", 0))
        house_lords = payload.get("house_lords")
        if not house_lords:
            ascendant_deg = float(payload.get("ascendant", 0))
            house_lords = derive_house_lords(ascendant_deg)
        else:
            house_lords = {int(k): str(v) for k, v in house_lords.items()}

        res = compute_wealth_activation_timeline(
            jd_ut=jd_ut,
            moon_sidereal_long=moon_lon,
            house_lords=house_lords,
            years_ahead=float(payload.get("years", 80.0))
        )
        return JSONResponse(res)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

from dasha.business_activation import compute_business_activation_timeline

@app.post("/api/dasha/business-activation")
def api_business_activation(payload: Dict = Body(...)):
    try:
        jd_ut = float(payload.get("jd_ut", 0))
        moon_lon = float(payload.get("moon_lon", 0))
        house_lords = payload.get("house_lords")
        if not house_lords:
            ascendant_deg = float(payload.get("ascendant", 0))
            from dasha.wealth_activation import derive_house_lords
            house_lords = derive_house_lords(ascendant_deg)
        else:
            house_lords = {int(k): str(v) for k, v in house_lords.items()}

        res = compute_business_activation_timeline(
            jd_ut=jd_ut,
            moon_sidereal_long=moon_lon,
            house_lords=house_lords,
            years_ahead=float(payload.get("years", 80.0))
        )
        return JSONResponse(res)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



from dasha.govt_job_activation import compute_govt_job_activation_timeline

def _safe_float(val, default=0.0):
    try:
        if val is None or val == "" or val == "undefined" or val == "null":
            return default
        return float(val)
    except (ValueError, TypeError):
        return default

@app.post("/api/dasha/govt-job-activation")
def api_govt_job_activation(payload: Dict = Body(...)):
    try:
        jd_ut = _safe_float(payload.get("jd_ut"), 0.0)
        moon_lon = _safe_float(payload.get("moon_lon"), 0.0)
        date_str = payload.get("date")
        time_str = payload.get("time") or "12:00:00"
        tz_offset = _safe_float(payload.get("tz_offset"), 5.5)
        lat = _safe_float(payload.get("lat"), 28.6)
        lon = _safe_float(payload.get("lon"), 77.2)

        if (not jd_ut or jd_ut == 2451545.0 or not moon_lon) and date_str:
            try:
                data = assemble_report_data(
                    name=payload.get("name") or "User",
                    date=date_str,
                    time=time_str,
                    tz_offset=tz_offset,
                    lat=lat,
                    lon=lon
                )
                jd_ut = data.get("jd_ut", jd_ut)
                pos = data.get("planet_positions", [])
                moon_item = next((p for p in pos if p.get("planet") == "Moon"), None)
                if moon_item:
                    moon_lon = _safe_float(moon_item.get("degree"), moon_lon)
                if not payload.get("ascendant"):
                    asc_item = next((p for p in pos if p.get("planet") in ["Lagna", "Ascendant"]), None)
                    if asc_item:
                        payload["ascendant"] = _safe_float(asc_item.get("degree"), 0.0)
            except Exception as ex:
                print(f"[GOVT DASH] assemble_report_data warning: {ex}")

        house_lords = payload.get("house_lords")
        if not house_lords:
            ascendant_deg = _safe_float(payload.get("ascendant"), 0.0)
            house_lords = derive_house_lords(ascendant_deg)
        else:
            try:
                house_lords = {int(k): str(v) for k, v in house_lords.items()}
            except Exception:
                ascendant_deg = _safe_float(payload.get("ascendant"), 0.0)
                house_lords = derive_house_lords(ascendant_deg)

        house_details = {}
        if "data" in locals() and data:
            houses_dict = data.get("charts", {}).get("houses", {})
            planets_list = data.get("planet_positions", [])
            for h_num in range(1, 13):
                h_info = houses_dict.get(str(h_num)) or houses_dict.get(h_num) or {}
                s_name = h_info.get("sign_name", "")
                p_in_h = [p.get("planet") for p in planets_list if p.get("house") == h_num and p.get("planet") not in ["Lagna", "Ascendant"]]
                house_details[h_num] = {
                    "sign": s_name,
                    "lord": house_lords.get(h_num, ""),
                    "occupants": [p for p in p_in_h if p]
                }

        res = compute_govt_job_activation_timeline(
            jd_ut=jd_ut if jd_ut > 0 else 2451545.0,
            moon_sidereal_long=moon_lon,
            house_lords=house_lords,
            house_details=house_details,
            years_ahead=_safe_float(payload.get("years"), 80.0)
        )
        return JSONResponse(res)
    except Exception as e:
        import traceback
        traceback.print_exc()
        try:
            res = compute_govt_job_activation_timeline(
                jd_ut=2451545.0,
                moon_sidereal_long=0.0,
                house_lords=derive_house_lords(0.0),
                years_ahead=80.0
            )
            return JSONResponse(res)
        except Exception:
            return JSONResponse({
                "user_current_age": 25.0,
                "target_max_age": 55.0,
                "age_filter_summary": "Current Age to Age 55",
                "govt_lords": [],
                "timeline": []
            })

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

@app.post("/api/dasha/timeline")
def api_dasha_timeline(payload: Dict = Body(...)):
    try:
        date_str = payload.get("date", "1990-10-01")
        time_str = payload.get("time", "12:00:00")
        if time_str and len(time_str.split(':')) == 2:
            time_str += ':00'
        tz_offset = float(payload.get("tz_offset", 5.5))
        
        from astronomy.julian import datetime_to_julian
        from dasha_engine.ephemeris_engine import SwissEphemerisEngine
        import datetime
        
        birth_dt_local = datetime.datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M:%S")
        birth_dt_utc = birth_dt_local - datetime.timedelta(hours=tz_offset)
        jd_ut = datetime_to_julian(birth_dt_utc)
        
        try:
            ephe = SwissEphemerisEngine()
            moon_lon = ephe.get_planet_longitude(birth_dt_utc, 1) # 1 is Moon
        except:
            moon_lon = 60.0
            
        from dasha.vimshottari import compute_vimshottari_full
        res = compute_vimshottari_full(jd_ut, moon_lon, years_ahead=120)
        return JSONResponse({"vimshottari": res, "jd_ut": jd_ut})
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/dasha/all-nakshatra")
def api_all_nakshatra_dashas(payload: Dict = Body(...)):
    try:
        date_str = payload.get("date", "1990-10-01")
        time_str = payload.get("time", "12:00:00")
        tz_offset = float(payload.get("tz_offset", 5.5))
        
        from astronomy.julian import datetime_to_julian
        from dasha_engine.ephemeris_engine import SwissEphemerisEngine
        import datetime
        
        birth_dt_local = datetime.datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M:%S")
        birth_dt_utc = birth_dt_local - datetime.timedelta(hours=tz_offset)
        jd_ut = datetime_to_julian(birth_dt_utc)
        
        ephe = None
        try:
            ephe = SwissEphemerisEngine()
            moon_lon = ephe.get_planet_longitude(birth_dt_utc, 1)
        except:
            moon_lon = 60.0 # fallback

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid parameter: {e}")

    # Standard placeholders starting from "Sun" for the scaffolds
    start_planet = payload.get("start_planet", "Sun")

    def expand_dashas(md_list, total_years, max_levels=4, offset_years=0):
        if not md_list: return []
        # Infer order and years from the first 20 items to ensure we get a full cycle
        order = []
        years_dict = {}
        for md in md_list[:20]:
            l = md.get("lord", md.get("item"))
            if l not in years_dict:
                order.append(l)
                years_dict[l] = md.get("duration", 0)
        
        def recurse(current_level, current_lord_path, current_start, current_dur):
            if current_level == max_levels:
                if current_start + current_dur > offset_years:
                    return [{
                        "lord": current_lord_path,
                        "start": current_start,
                        "end": current_start + current_dur,
                        "duration": current_dur
                    }]
                return []
            
            expanded = []
            base_lord = current_lord_path.split("-")[-1]
            try:
                start_idx = order.index(base_lord)
            except ValueError:
                start_idx = 0
            
            cur = current_start
            for i in range(len(order)):
                ad_lord = order[(start_idx + i) % len(order)]
                ad_dur = (years_dict[ad_lord] / total_years) * current_dur
                actual_dur = min(ad_dur, (current_start + current_dur) - cur)
                if actual_dur <= 0:
                    break
                
                if cur + actual_dur <= offset_years:
                    cur += actual_dur
                    continue

                expanded.extend(recurse(current_level + 1, f"{current_lord_path}-{ad_lord}", cur, actual_dur))
                cur += actual_dur
                
                if len(expanded) > 20:  # Optimization for UI slice(0,10)
                    break
            return expanded

        final_expanded = []
        for md in md_list:
            md_lord = md.get("lord", md.get("item"))
            md_start = md.get("start", 0)
            md_dur = md.get("duration", 0)
            if md_start + md_dur <= offset_years:
                continue
            final_expanded.extend(recurse(1, md_lord, md_start, md_dur))
            if len(final_expanded) > 20:
                break
        return final_expanded

    offsets = payload.get("offsets", {})
    res = {
        "vimshottari": compute_vimshottari_full(jd_ut, moon_lon, years_ahead=120) if jd_ut and moon_lon else [],
        "ashtottari": expand_dashas(compute_ashtottari(0, 108), 108, offset_years=offsets.get("ashtottari", 0)),
        "shodashottari": expand_dashas(compute_shodashottari(start_planet=start_planet, years_ahead=116.0), 116, offset_years=offsets.get("shodashottari", 0)),
        "chaturshitisama": expand_dashas(compute_chaturshitisama(start_planet=start_planet, years_ahead=84.0), 84, offset_years=offsets.get("chaturshitisama", 0)),
        "dwadashottari": expand_dashas(compute_dwadashottari(moon_lon, years_ahead=112.0), 112, offset_years=offsets.get("dwadashottari", 0)),
        "panchottari": expand_dashas(compute_panchottari(start_planet=start_planet, years_ahead=105.0), 105, offset_years=offsets.get("panchottari", 0)),
        "shatabdika": expand_dashas(compute_shatabdika(moon_lon, years_ahead=100.0), 100, offset_years=offsets.get("shatabdika", 0)),
        "dwisaptatisama": expand_dashas(compute_dwisaptatisama(moon_lon, years_ahead=72.0), 72, offset_years=offsets.get("dwisaptatisama", 0)),
        "yogini": compute_yogini_full(jd_ut, moon_lon, years_ahead=108.0) if jd_ut and moon_lon else [],
    }

    # Vimshottari returns nested dictionaries via `compute_vimshottari_full`.
    # Let's map its nested structure to 5 levels flat for the UI
    vim_flat = []
    vim_offset = offsets.get("vimshottari", 0)
    target_jd = jd_ut + vim_offset * 365.2425

    from dasha.vimshottari import VIM_ORDER, VIM_DUR

    def generate_vim_5_levels():
        for md in res["vimshottari"]:
            if md["end_jd"] < target_jd: continue
            if len(vim_flat) > 25: return
            md_lord = md["lord"]
            
            for ad in md.get("antardashas", []):
                if ad["end_jd"] < target_jd: continue
                if len(vim_flat) > 25: return
                
                ad_lord = ad["lord"]
                ad_dur = ad.get("duration_years", 0)
                ad_start_jd = ad["start_jd"]
                
                # Level 3: Pratyantardasha
                ad_idx = VIM_ORDER.index(ad_lord)
                pt_start_jd = ad_start_jd
                for i_pt in range(9):
                    pt_lord = VIM_ORDER[(ad_idx + i_pt) % 9]
                    pt_dur = (ad_dur * VIM_DUR[pt_lord]) / 120.0
                    pt_end_jd = pt_start_jd + pt_dur * 365.2425
                    
                    if pt_end_jd < target_jd: 
                        pt_start_jd = pt_end_jd
                        continue
                    if len(vim_flat) > 25: return

                    # Level 4: Sookshmadasha
                    pt_idx = VIM_ORDER.index(pt_lord)
                    sk_start_jd = pt_start_jd
                    for i_sk in range(9):
                        sk_lord = VIM_ORDER[(pt_idx + i_sk) % 9]
                        sk_dur = (pt_dur * VIM_DUR[sk_lord]) / 120.0
                        sk_end_jd = sk_start_jd + sk_dur * 365.2425

                        if sk_end_jd < target_jd:
                            sk_start_jd = sk_end_jd
                            continue
                        if len(vim_flat) > 25: return

                        # Level 5: Pranadasha
                        sk_idx = VIM_ORDER.index(sk_lord)
                        pr_start_jd = sk_start_jd
                        for i_pr in range(9):
                            pr_lord = VIM_ORDER[(sk_idx + i_pr) % 9]
                            pr_dur = (sk_dur * VIM_DUR[pr_lord]) / 120.0
                            pr_end_jd = pr_start_jd + pr_dur * 365.2425
                            
                            if pr_end_jd < target_jd:
                                pr_start_jd = pr_end_jd
                                continue
                                
                            vim_flat.append({
                                "lord": f"{md_lord}-{ad_lord}-{pt_lord}-{sk_lord}-{pr_lord}",
                                "start_jd": pr_start_jd,
                                "duration_jd": pr_dur * 365.2425
                            })
                            
                            if len(vim_flat) > 25: return
                            pr_start_jd = pr_end_jd
                            
                        sk_start_jd = sk_end_jd
                    pt_start_jd = pt_end_jd

    generate_vim_5_levels()

    vim_filtered = []
    for i, item in enumerate(vim_flat):
        end_jd = vim_flat[i+1]["start_jd"] if i+1 < len(vim_flat) else item["start_jd"] + item.get("duration_jd", 10)
        if end_jd > target_jd:
            vim_filtered.append(item)
            if len(vim_filtered) > 20:
                break
    res["vimshottari"] = vim_filtered

    
    # Not needed since we mapped item to lord inside expand_dashas
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
            language=payload.get("language", "en"),
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
                active_sections=payload.get("active_sections"),
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

@app.post("/api/wheel/overlay")
def api_wheel_overlay(payload: Dict = Body(...)):
    try:
        import sys, os
        api_dir = os.path.dirname(os.path.abspath(__file__))
        if api_dir not in sys.path:
            sys.path.append(api_dir)
            
        from wheel_system.dual_ring_overlay import DualRingOverlay
        natal = payload.get("natal_positions", {})
        transit = payload.get("transit_positions", {})
        offset = payload.get("offset", 0)
        is_anti = payload.get("is_anticlockwise", False)
        
        if offset != 0 or is_anti:
            def transform(v):
                v_trans = -v if is_anti else v
                return (v_trans - offset) % 360
                
            natal = {k: transform(v) for k, v in natal.items()}
            transit = {k: transform(v) for k, v in transit.items()}
            
        overlay = DualRingOverlay()
        result = overlay.build_overlay(natal, transit)
        return JSONResponse(result)
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"[API ERROR] Wheel overlay failed: {error_trace}")
        raise HTTPException(status_code=500, detail=str(e))

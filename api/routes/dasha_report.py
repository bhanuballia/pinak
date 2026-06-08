from fastapi import APIRouter, Body, HTTPException
from typing import Dict, Any, List
from dasha_engine.mahadasha import MahadashaEngine
from dasha_engine.antardasha import AntardashaEngine
from dasha_engine.event_prediction import EventPredictionEngine
from dasha_engine.remedies import DashaRemedies
from dasha_engine.ai_writer import DashaAIWriter
from dasha_engine.ephemeris_engine import SwissEphemerisEngine
from dasha_engine.nakshatra_engine import NakshatraEngine
from dasha_engine.vimshottari_balance import VimshottariBalanceCalculator
from dasha_engine.monthly_timeline import MonthlyPredictionTimeline
from dasha_engine.marriage_timing_ai import MarriageTimingAI
from dasha_engine.wealth_timing_ai import WealthTimingAI
from dasha_engine.health_forecasting import HealthRiskForecasting
from dasha.vimshottari import compute_vimshottari_full, VIM_ORDER, VIM_DUR
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import math

router = APIRouter()

# ─── Planet Hindi Abbreviations ───────────────────────────────────────────────
PLANET_ABBR_HI = {
    "Sun":     "सू",
    "Moon":    "चं",
    "Mars":    "म",
    "Mercury": "बु",
    "Jupiter": "गु",
    "Venus":   "शु",
    "Saturn":  "श",
    "Rahu":    "रा",
    "Ketu":    "के",
}

SIGN_NAMES_HI = [
    "मेष","वृष","मिथुन","कर्क","सिंह","कन्या",
    "तुला","वृश्चिक","धनु","मकर","कुम्भ","मीन"
]

TARA_NAMES = [
    "जन्म","सम्पद","विपद","क्षेम","प्रत्यरि","साधक","वध","मित्र","परम मित्र"
]

NAK_LORD_ORDER = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"]

NAKSHATRA_LORD_MAP = NAK_LORD_ORDER * 3

PLANET_SWE_IDS = {
    "Sun": 0,
    "Moon": 1,
    "Mercury": 2,
    "Venus": 3,
    "Mars": 4,
    "Jupiter": 5,
    "Saturn": 6,
    "Rahu": 10,  # swe.TRUE_NODE
}

def _jd_to_datetime(jd: float) -> datetime:
    """Convert Julian Day to datetime (UTC)."""
    jd_epoch = 2440587.5  # JD for 1970-01-01 00:00 UTC
    unix_ts = (jd - jd_epoch) * 86400.0
    return datetime(1970, 1, 1) + timedelta(seconds=unix_ts)

def _datetime_to_jd(dt: datetime) -> float:
    jd_epoch = 2440587.5
    unix_ts = (dt - datetime(1970, 1, 1)).total_seconds()
    return jd_epoch + unix_ts / 86400.0

def _get_tara(birth_nak_idx: int, target_nak_idx: int):
    diff = (target_nak_idx - birth_nak_idx) % 27
    num = (diff % 9) + 1
    return num, TARA_NAMES[num - 1], diff + 1  # tara_num, tara_name, nak_distance (1-27)

def _sign_from_lon(lon: float) -> str:
    return SIGN_NAMES_HI[int(lon / 30) % 12]

def _get_planet_transit_sign(ephe: Any, jd: float, planet_name: str) -> str:
    if not ephe:
        fallback_map = {
            "Jupiter": "मिथुन",
            "Moon": "मिथुन",
            "Sun": "वृष",
            "Mercury": "वृष",
            "Venus": "वृष",
            "Saturn": "कुम्भ",
            "Mars": "मीन",
            "Rahu": "मीन",
            "Ketu": "कन्या",
        }
        return fallback_map.get(planet_name, "मेष")
    try:
        if planet_name == "Ketu":
            rahu_lon = ephe.get_planet_longitude_jd(jd, 10)
            lon = (rahu_lon + 180.0) % 360.0
        else:
            swe_id = PLANET_SWE_IDS.get(planet_name, 0)
            lon = ephe.get_planet_longitude_jd(jd, swe_id)
        return _sign_from_lon(lon)
    except Exception:
        return "मेष"

def _planet_lord_nakshatra_nearest(planet: str, birth_nak_idx: int) -> int:
    """Returns the nakshatra index (0-26) of the planet that is nearest forward from birth_nak_idx."""
    planet_naks = [i for i, lord in enumerate(NAKSHATRA_LORD_MAP) if lord == planet]
    if not planet_naks:
        return 0
    best = min(planet_naks, key=lambda n: (n - birth_nak_idx) % 27)
    return best

def _build_prana_rows(
    mahadashas: List[Dict],
    birth_jd: float,
    birth_nak_idx: int,
    current_jd: float,
    tz_offset: float = 5.5,
    ephe: Any = None,
    window_days: float = 3.0,
    birth_longitudes: Dict[str, float] = None,
) -> List[Dict]:
    """Walk the 5-level tree and return rows near current_jd."""
    rows = []
    DENOM = 120.0

    for md in mahadashas:
        md_start_jd = md["start_jd"]
        md_end_jd = md["end_jd"]
        if md_end_jd < current_jd - 30:
            continue
        if md_start_jd > current_jd + window_days * 4:
            break

        md_lord = md["lord"]
        md_dur = md["duration_years"]

        for ad in md.get("antardashas", []):
            ad_start_jd = ad["start_jd"]
            ad_end_jd = ad["end_jd"]
            if ad_end_jd < current_jd - 10:
                continue
            if ad_start_jd > current_jd + window_days * 3:
                break

            ad_lord = ad["lord"]
            ad_dur = ad["duration_years"]

            # Pratyantar level
            pt_start_jd = ad_start_jd
            ad_idx = VIM_ORDER.index(ad_lord)
            for i_pt in range(9):
                pt_lord = VIM_ORDER[(ad_idx + i_pt) % 9]
                pt_dur = (ad_dur * VIM_DUR[pt_lord]) / DENOM
                pt_end_jd = pt_start_jd + pt_dur * 365.2425
                if pt_end_jd < current_jd - 3:
                    pt_start_jd = pt_end_jd
                    continue
                if pt_start_jd > current_jd + window_days * 2:
                    break

                # Sukshma level
                sk_start_jd = pt_start_jd
                pt_idx = VIM_ORDER.index(pt_lord)
                for i_sk in range(9):
                    sk_lord = VIM_ORDER[(pt_idx + i_sk) % 9]
                    sk_dur = (pt_dur * VIM_DUR[sk_lord]) / DENOM
                    sk_end_jd = sk_start_jd + sk_dur * 365.2425
                    if sk_end_jd < current_jd - 1:
                        sk_start_jd = sk_end_jd
                        continue
                    if sk_start_jd > current_jd + window_days:
                        break

                    # Prana level
                    pr_start_jd = sk_start_jd
                    sk_idx = VIM_ORDER.index(sk_lord)
                    for i_pr in range(9):
                        pr_lord = VIM_ORDER[(sk_idx + i_pr) % 9]
                        pr_dur = (sk_dur * VIM_DUR[pr_lord]) / DENOM
                        pr_end_jd = pr_start_jd + pr_dur * 365.2425

                        if pr_end_jd < current_jd - 0.25:
                            pr_start_jd = pr_end_jd
                            continue
                        if pr_start_jd > current_jd + window_days:
                            break

                        # Convert to local datetime
                        pr_dt = _jd_to_datetime(pr_start_jd)
                        local_dt = pr_dt + timedelta(hours=tz_offset)

                        # Age at start
                        birth_dt = _jd_to_datetime(birth_jd)
                        age = int((pr_dt - birth_dt).days / 365.25)

                        # Tara — based on Prana lord's nearest nakshatra from birth
                        pr_nak_idx = _planet_lord_nakshatra_nearest(pr_lord, birth_nak_idx)
                        tara_num, tara_name, nak_distance = _get_tara(birth_nak_idx, pr_nak_idx)

                        # Rashi distance from birth Moon
                        if birth_longitudes and "Moon" in birth_longitudes:
                            birth_moon_lon = birth_longitudes["Moon"]
                            birth_moon_rashi_idx = int(birth_moon_lon / 30) % 12
                            lord_lon = birth_longitudes.get(pr_lord, 0.0)
                            lord_rashi_idx = int(lord_lon / 30) % 12
                            rashi_distance = (lord_rashi_idx - birth_moon_rashi_idx) % 12 + 1
                        else:
                            rashi_distance = tara_num

                        chain = "-".join([
                            PLANET_ABBR_HI.get(md_lord, md_lord),
                            PLANET_ABBR_HI.get(ad_lord, ad_lord),
                            PLANET_ABBR_HI.get(pt_lord, pt_lord),
                            PLANET_ABBR_HI.get(sk_lord, sk_lord),
                            PLANET_ABBR_HI.get(pr_lord, pr_lord),
                        ])

                        # Dynamic transit of the dasha lords at pr_start_jd
                        t_md = _get_planet_transit_sign(ephe, pr_start_jd, md_lord)
                        t_ad = _get_planet_transit_sign(ephe, pr_start_jd, ad_lord)
                        t_pt = _get_planet_transit_sign(ephe, pr_start_jd, pt_lord)
                        t_sk = _get_planet_transit_sign(ephe, pr_start_jd, sk_lord)
                        t_pr = _get_planet_transit_sign(ephe, pr_start_jd, pr_lord)
                        row_transit_str = f"{t_md}-{t_ad}-{t_pt}-{t_sk}-{t_pr}"

                        rows.append({
                            "dasha_chain": chain,
                            "md": md_lord,
                            "ad": ad_lord,
                            "pt": pt_lord,
                            "sk": sk_lord,
                            "pr": pr_lord,
                            "age": age,
                            "start_date": local_dt.strftime("%d-%m-%Y"),
                            "start_time": local_dt.strftime("%H:%M"),
                            "tara_name": tara_name,
                            "tara_num": tara_num,
                            "nak_distance": nak_distance,
                            "rashi_distance": rashi_distance,
                            "gochar": row_transit_str,
                            "is_current": pr_start_jd <= current_jd < pr_end_jd,
                            "jd_start": pr_start_jd,
                        })

                        pr_start_jd = pr_end_jd
                        if len(rows) >= 120:
                            return rows

                    sk_start_jd = sk_end_jd

                pt_start_jd = pt_end_jd

    return rows


def _build_antardasha_rows(
    mahadashas: List[Dict],
    birth_jd: float,
    birth_nak_idx: int,
    current_jd: float,
    tz_offset: float = 5.5,
    ephe: Any = None,
    birth_longitudes: Dict[str, float] = None,
) -> List[Dict]:
    """Build Mahadasha and Antardasha dasha rows (2 levels deep)."""
    rows = []
    for md in mahadashas:
        md_lord = md["lord"]
        for ad in md.get("antardashas", []):
            ad_lord = ad["lord"]
            ad_start_jd = ad["start_jd"]
            ad_end_jd = ad["end_jd"]

            # Convert to local datetime
            ad_dt = _jd_to_datetime(ad_start_jd)
            local_dt = ad_dt + timedelta(hours=tz_offset)

            # Age at start
            birth_dt = _jd_to_datetime(birth_jd)
            age = int((ad_dt - birth_dt).days / 365.25)
            if age < 0:
                age = 0

            # Tara — based on Antardasha lord's nearest nakshatra from birth
            ad_nak_idx = _planet_lord_nakshatra_nearest(ad_lord, birth_nak_idx)
            tara_num, tara_name, nak_distance = _get_tara(birth_nak_idx, ad_nak_idx)

            # Rashi distance from birth Moon
            if birth_longitudes and "Moon" in birth_longitudes:
                birth_moon_lon = birth_longitudes["Moon"]
                birth_moon_rashi_idx = int(birth_moon_lon / 30) % 12
                lord_lon = birth_longitudes.get(ad_lord, 0.0)
                lord_rashi_idx = int(lord_lon / 30) % 12
                rashi_distance = (lord_rashi_idx - birth_moon_rashi_idx) % 12 + 1
            else:
                rashi_distance = tara_num

            chain = "-".join([
                PLANET_ABBR_HI.get(md_lord, md_lord),
                PLANET_ABBR_HI.get(ad_lord, ad_lord),
            ])

            # Dynamic transit of the dasha lords at ad_start_jd
            t_md = _get_planet_transit_sign(ephe, ad_start_jd, md_lord)
            t_ad = _get_planet_transit_sign(ephe, ad_start_jd, ad_lord)
            row_transit_str = f"{t_md}-{t_ad}"

            rows.append({
                "dasha_chain": chain,
                "md": md_lord,
                "ad": ad_lord,
                "pt": "",
                "sk": "",
                "pr": "",
                "age": age,
                "start_date": local_dt.strftime("%d-%m-%Y"),
                "start_time": local_dt.strftime("%H:%M"),
                "tara_name": tara_name,
                "tara_num": tara_num,
                "nak_distance": nak_distance,
                "rashi_distance": rashi_distance,
                "gochar": row_transit_str,
                "is_current": ad_start_jd <= current_jd < ad_end_jd,
                "jd_start": ad_start_jd,
            })
    return rows


@router.post("/vimshottari-table")
async def vimshottari_table(payload: Dict[str, Any] = Body(...)):
    try:
        date_str = payload.get("date", "1990-10-01")
        time_str = payload.get("time", "12:00:00")
        tz_offset = float(payload.get("tz", 5.5))
        lat = float(payload.get("lat", 28.6))
        lon_deg = float(payload.get("lon", 77.2))
        moon_lon = float(payload.get("moon_lon", -1))
        levels = int(payload.get("levels", 5))

        # Parse birth datetime
        birth_dt_local = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M:%S")
        birth_dt_utc = birth_dt_local - timedelta(hours=tz_offset)
        birth_jd = _datetime_to_jd(birth_dt_utc)

        # Instantiate ephemeris engine early
        ephe = None
        try:
            ephe = SwissEphemerisEngine()
        except Exception:
            pass

        # If moon_lon not provided, try to compute from ephemeris
        if moon_lon < 0:
            if ephe:
                try:
                    moon_lon = ephe.get_planet_longitude(birth_dt_utc, 1)
                except Exception:
                    moon_lon = 60.0  # fallback: Taurus
            else:
                moon_lon = 60.0

        # Birth nakshatra index
        birth_nak_idx = int(moon_lon / (360 / 27)) % 27

        # Compute birth longitudes for all planets
        birth_longitudes = {}
        if ephe:
            for p, pid in PLANET_SWE_IDS.items():
                try:
                    birth_longitudes[p] = ephe.get_planet_longitude(birth_dt_utc, pid)
                except Exception:
                    birth_longitudes[p] = 0.0
            birth_longitudes["Ketu"] = (birth_longitudes.get("Rahu", 0.0) + 180.0) % 360.0
        else:
            birth_longitudes["Moon"] = moon_lon

        # Generate Mahadasha structure (3 levels deep)
        mahadashas = compute_vimshottari_full(birth_jd, moon_lon, years_ahead=120)

        # Current JD or Transit Date
        transit_date_str = payload.get("transit_date")
        if transit_date_str:
            try:
                if transit_date_str.endswith("Z"):
                    transit_date_str = transit_date_str[:-1]
                if "T" in transit_date_str:
                    now_utc = datetime.fromisoformat(transit_date_str)
                else:
                    now_utc = datetime.strptime(transit_date_str, "%Y-%m-%d %H:%M:%S")
            except Exception:
                now_utc = datetime.utcnow()
        else:
            now_utc = datetime.utcnow()
        current_jd = _datetime_to_jd(now_utc)

        # Transit signs (simplified — Jupiter, Moon, Sun)
        transit_str = "मिथुन-मिथुन-वृष"  # placeholder; can be enhanced with live ephe
        if ephe:
            try:
                jup_lon = ephe.get_planet_longitude(now_utc, 5)  # Jupiter
                moon_now = ephe.get_planet_longitude(now_utc, 1)
                sun_now  = ephe.get_planet_longitude(now_utc, 0)
                transit_str = (
                    _sign_from_lon(jup_lon) + "-" +
                    _sign_from_lon(moon_now) + "-" +
                    _sign_from_lon(sun_now)
                )
            except Exception:
                pass

        if levels == 2:
            rows = _build_antardasha_rows(
                mahadashas=mahadashas,
                birth_jd=birth_jd,
                birth_nak_idx=birth_nak_idx,
                current_jd=current_jd,
                tz_offset=tz_offset,
                ephe=ephe,
                birth_longitudes=birth_longitudes,
            )
        else:
            rows = _build_prana_rows(
                mahadashas=mahadashas,
                birth_jd=birth_jd,
                birth_nak_idx=birth_nak_idx,
                current_jd=current_jd,
                tz_offset=tz_offset,
                ephe=ephe,
                window_days=60.0,
                birth_longitudes=birth_longitudes,
            )

        # Sort by jd_start and trim
        rows.sort(key=lambda r: r["jd_start"])
        # Remove the internal jd_start field
        for r in rows:
            r.pop("jd_start", None)

        return {"rows": rows, "birth_nak_idx": birth_nak_idx, "moon_lon": moon_lon}

    except Exception as e:
        import traceback
        raise HTTPException(status_code=500, detail=str(e) + "\n" + traceback.format_exc())


@router.post("/dasha-report")
async def generate_dasha_report(payload: Dict[str, Any] = Body(...)):
    try:
        name      = payload.get("name", "User")
        date_str  = payload.get("date", "1990-10-01")
        time_str  = payload.get("time", "12:00:00")
        tz_offset = float(payload.get("tz", 5.5))

        # Convert birth time to UTC then JD (same as vimshottari_table)
        birth_dt_local = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M:%S")
        birth_dt_utc   = birth_dt_local - timedelta(hours=tz_offset)
        birth_jd       = _datetime_to_jd(birth_dt_utc)

        # ── Swiss Ephemeris ────────────────────────────────────────────────
        ephe = SwissEphemerisEngine()
        moon_lon    = ephe.get_planet_longitude(birth_dt_utc, 1)
        venus_lon   = ephe.get_planet_longitude(birth_dt_utc, 3)
        jupiter_lon = ephe.get_planet_longitude(birth_dt_utc, 5)
        saturn_lon  = ephe.get_planet_longitude(birth_dt_utc, 6)

        # ── Nakshatra info ─────────────────────────────────────────────────
        nak_engine = NakshatraEngine()
        nak_info   = nak_engine.calculate(moon_lon)

        # ── Use same accurate engine as Vimshottari table ──────────────────
        mahadashas = compute_vimshottari_full(birth_jd, moon_lon, years_ahead=120)
        current_jd = _datetime_to_jd(datetime.utcnow())

        # Find active mahadasha
        current_md = mahadashas[0]
        for md in mahadashas:
            if md["start_jd"] <= current_jd < md["end_jd"]:
                current_md = md
                break

        # Find active antardasha within that mahadasha
        current_ad = current_md.get("antardashas", [{}])[0]
        for ad in current_md.get("antardashas", []):
            if ad["start_jd"] <= current_jd < ad["end_jd"]:
                current_ad = ad
                break

        md_lord = current_md.get("lord", "Jupiter")
        ad_lord = current_ad.get("lord", "Venus")

        # ── Event predictions ──────────────────────────────────────────────
        prediction_engine = EventPredictionEngine()
        predictions = prediction_engine.predict(md_lord, ad_lord, {})

        # ── AI scores derived from actual planet positions ─────────────────
        venus_sign        = int(venus_lon / 30) % 12
        venus_strength    = 85 if venus_sign in (1, 6, 11) else (65 if venus_sign in (0, 7) else 50)
        moon_sign         = int(moon_lon / 30) % 12
        seventh_sign      = (moon_sign + 6) % 12
        seventh_house_score = 75 if int(venus_lon / 30) % 12 == seventh_sign else 55
        d9_strength       = 70 if venus_sign in (1, 6, 11, 0, 7) else 55

        benefics     = {"Jupiter", "Venus", "Mercury", "Moon"}
        malefics     = {"Saturn", "Mars", "Rahu", "Ketu", "Sun"}
        dasha_support = 80 if md_lord in benefics else 45

        marriage_ai    = MarriageTimingAI()
        marriage_result = marriage_ai.predict(seventh_house_score, venus_strength, d9_strength, dasha_support, 65)

        eleventh_sign   = (moon_sign + 10) % 12
        jupiter_in_11th = int(jupiter_lon / 30) % 12 == eleventh_sign
        wealth_dasha    = 85 if md_lord in {"Jupiter", "Venus", "Mercury"} else 50
        wealth_transit  = 78 if jupiter_in_11th else 60

        wealth_ai    = WealthTimingAI()
        wealth_result = wealth_ai.predict(wealth_dasha, wealth_transit, 70, 72)

        sixth_risk   = 60 if md_lord in malefics else 25
        eighth_risk  = 45 if ad_lord in malefics else 20
        saturn_score = min(100, int((saturn_lon % 30) * 3))
        age          = int((datetime.utcnow() - birth_dt_utc).days / 365.25)

        health_ai    = HealthRiskForecasting()
        health_result = health_ai.forecast(sixth_risk, eighth_risk, saturn_score, age)

        # ── Timeline & summary ─────────────────────────────────────────────
        timeline_engine = MonthlyPredictionTimeline()
        timeline = timeline_engine.generate(datetime.utcnow(), months=12)

        writer  = DashaAIWriter()
        summary = writer.generate_summary(
            md_lord, ad_lord, predictions,
            DashaRemedies().get_remedies(md_lord)
        )

        return {
            "success": True,
            "message": "AI Dasha report generated",
            "summary": summary,
            "predictions": predictions,
            "marriage_ai": marriage_result,
            "wealth_ai": wealth_result,
            "health_ai": health_result,
            "timeline": timeline,
            "nakshatra": nak_info,
            "current_mahadasha": md_lord,
            "current_antardasha": ad_lord,
        }
    except Exception as e:
        import traceback


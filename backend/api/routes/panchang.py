from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import datetime
import calendar
from astronomy.julian import datetime_to_julian, julian_to_datetime
from astronomy.sun_calculations import calculate_noaa_sunrise_sunset
from panchang.tithi_yoga_karana import compute_tithi, compute_nakshatra, compute_yoga, compute_karana, get_tithi_boundaries, get_nakshatra_boundaries
from panchang.adhik_maas import check_adhik_maas, find_next_adhik_maas
from panchang.ekadashi_rules import check_ekadashi_vrat, check_smarta_ekadashi_vrat
from panchang.choghadiya import calculate_choghadiya
from panchang.sankranti import check_daily_sankranti, get_sankranti_for_month
from core.utils import ZODIAC_SIGNS, get_sign_index

router = APIRouter()

class ChoghadiyaOracleRequest(BaseModel):
    question: str
    current_time: str # "HH:MM AM/PM" or similar from frontend, or just use backend time
    choghadiya_data: Dict[str, Any]

def get_day_name(date: datetime.date) -> str:
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    return days[date.weekday()]

def calculate_muhurta_periods(sunrise_dt: datetime.datetime, sunset_dt: datetime.datetime):
    """
    Calculate common muhurtas based on sunrise and sunset.
    Note: These are standard approximations.
    """
    day_duration = (sunset_dt - sunrise_dt).total_seconds()
    eighth_part = day_duration / 8
    
    # Rahu Kaal, Gulika, Yamaganda depend on week day
    day_idx = sunrise_dt.weekday() # 0=Mon, 6=Sun
    
    # Standard mapping (Approximate)
    # Day: Mon Tue Wed Thu Fri Sat Sun
    # Rahu: 2nd 7th 5th 6th 4th 3rd 8th (part of day)
    rahu_parts = [1, 6, 4, 5, 3, 2, 7] # 0-indexed parts
    rahu_start = sunrise_dt + datetime.timedelta(seconds=rahu_parts[day_idx] * eighth_part)
    rahu_end = rahu_start + datetime.timedelta(seconds=eighth_part)

    # Abhijit Muhurta: 4th part of the day (approx 11:45 to 12:45)
    muhurta_duration = day_duration / 15
    abhijit_start = sunrise_dt + datetime.timedelta(seconds=7 * muhurta_duration)
    abhijit_end = abhijit_start + datetime.timedelta(seconds=muhurta_duration)

    # Brahma Muhurta: 96 minutes before sunrise to 48 minutes before sunrise
    brahma_start = sunrise_dt - datetime.timedelta(minutes=96)
    brahma_end = sunrise_dt - datetime.timedelta(minutes=48)

    return {
        "rahu_kaal": {"start": rahu_start.strftime("%I:%M %p"), "end": rahu_end.strftime("%I:%M %p")},
        "abhijit": {"start": abhijit_start.strftime("%I:%M %p"), "end": abhijit_end.strftime("%I:%M %p")},
        "brahma_muhurta": {"start": brahma_start.strftime("%I:%M %p"), "end": brahma_end.strftime("%I:%M %p")}
    }

def calculate_vedic_time(current_dt: datetime.datetime, sunrise_dt: datetime.datetime):
    """
    Calculate Vedic Time units from Sunrise.
    1 Day = 60 Ghati
    1 Ghati = 60 Pala
    1 Pala = 60 Vipala
    """
    # Total seconds since sunrise
    diff = (current_dt - sunrise_dt).total_seconds()
    if diff < 0: # It's before sunrise today, so it's technically the previous Vedic day
        # For simplicity, we'll just show 0 or handle correctly if we had yesterday's sunrise
        diff = 0
    
    # 1 Day (24h) = 86400 seconds
    # 60 Ghati = 86400 seconds => 1 Ghati = 1440 seconds
    ghati = diff / 1440
    pala = (ghati % 1) * 60
    vipala = (pala % 1) * 60
    
    # 30 Muhurtas in 24 hours => 1 Muhurta = 48 minutes = 2 Ghati
    muhurta_num = (ghati / 2) % 30
    
    return {
        "ghati": int(ghati),
        "pala": int(pala),
        "vipala": int(vipala),
        "muhurta_index": int(muhurta_num) + 1,
        "total_ghati": round(ghati, 2)
    }

@router.get("/daily")
async def get_daily_panchang(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    tz: float = Query(0.0, description="Timezone offset in hours"),
    date: Optional[str] = Query(None, description="ISO date YYYY-MM-DD")
):
    """
    Calculates detailed Panchang for the current time or a specific date.
    """
    try:
        if date:
            dt_local = datetime.datetime.strptime(date, "%Y-%m-%d")
            # Use current time for more precision if it's "today"
            now = datetime.datetime.now()
            if dt_local.date() == now.date():
                dt_local = now
        else:
            dt_local = datetime.datetime.now()

        dt_utc = dt_local - datetime.timedelta(hours=tz)
        jd_ut = datetime_to_julian(dt_utc)

        # Basic 5 Limbs
        tithi = compute_tithi(jd_ut)
        nakshatra = compute_nakshatra(jd_ut)
        yoga = compute_yoga(jd_ut)
        karana = compute_karana(jd_ut)
        day = get_day_name(dt_local)

        # Calculate precise Sunrise/Sunset for Muhurta calculations using NOAA algorithm
        rise_time, set_time = calculate_noaa_sunrise_sunset(dt_local.date(), lat, lon, tz)
        if rise_time and set_time:
            sunrise_dt = rise_time
            sunset_dt = set_time
        else:
            # Fallback for polar day/night where the sun doesn't rise/set
            sunrise_dt = datetime.datetime.combine(dt_local.date(), datetime.time(6, 0))
            sunset_dt = datetime.datetime.combine(dt_local.date(), datetime.time(18, 0))
        
        # Calculate Next Sunrise for Choghadiya Night calculations
        next_dt_local = dt_local + datetime.timedelta(days=1)
        next_rise_time, _ = calculate_noaa_sunrise_sunset(next_dt_local.date(), lat, lon, tz)
        next_sunrise_dt = next_rise_time if next_rise_time else datetime.datetime.combine(next_dt_local.date(), datetime.time(6, 0))

        muhurtas = calculate_muhurta_periods(sunrise_dt, sunset_dt)
        next_muhurtas = calculate_muhurta_periods(next_sunrise_dt, next_sunrise_dt + datetime.timedelta(hours=12)) # Approximate next sunset for Brahma Muhurta calculation
        muhurtas["next_brahma_muhurta"] = next_muhurtas["brahma_muhurta"]
        
        vedic_time = calculate_vedic_time(dt_local, sunrise_dt)
        choghadiya = calculate_choghadiya(sunrise_dt, sunset_dt, next_sunrise_dt)
        is_adhik = check_adhik_maas(jd_ut)
        sankranti = check_daily_sankranti(dt_local, tz)
        monthly_sankranti = get_sankranti_for_month(dt_local.year, dt_local.month, tz)

        return {
            "date": dt_local.strftime("%d %B %Y"),
            "day": day,
            "tithi": tithi,
            "nakshatra": nakshatra,
            "yoga": yoga,
            "karana": karana,
            "muhurtas": muhurtas,
            "vedic_time": vedic_time,
            "sun_rise": sunrise_dt.strftime("%I:%M %p"),
            "sun_set": sunset_dt.strftime("%I:%M %p"),
            "is_adhik_maas": is_adhik,
            "choghadiya": choghadiya,
            "sankranti": sankranti,
            "monthly_sankranti": monthly_sankranti
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/monthly")
async def get_monthly_panchang(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    tz: float = Query(0.0, description="Timezone offset in hours"),
    year: int = Query(..., description="Year"),
    month: int = Query(..., description="Month (1-12)")
):
    """
    Calculates detailed Panchang for an entire month.
    """
    try:
        num_days = calendar.monthrange(year, month)[1]
        monthly_data = []

        for day in range(1, num_days + 1):
            dt_local = datetime.datetime(year, month, day, 12, 0)
            
            rise_time, set_time = calculate_noaa_sunrise_sunset(dt_local.date(), lat, lon, tz)
            if rise_time and set_time:
                sunrise_dt = rise_time
                sunset_dt = set_time
            else:
                sunrise_dt = datetime.datetime.combine(dt_local.date(), datetime.time(6, 0))
                sunset_dt = datetime.datetime.combine(dt_local.date(), datetime.time(18, 0))
            
            # Get previous day's sunrise for Ekadashi logic
            prev_dt_local = dt_local - datetime.timedelta(days=1)
            prev_rise_time, _ = calculate_noaa_sunrise_sunset(prev_dt_local.date(), lat, lon, tz)
            if prev_rise_time:
                prev_sunrise_dt = prev_rise_time
            else:
                prev_sunrise_dt = datetime.datetime.combine(prev_dt_local.date(), datetime.time(6, 0))

            # Udaya Tithi Principle: Calculate Panchang attributes at the exact time of Sunrise
            dt_utc_sunrise = sunrise_dt - datetime.timedelta(hours=tz)
            jd_ut_sunrise = datetime_to_julian(dt_utc_sunrise)
            
            prev_dt_utc_sunrise = prev_sunrise_dt - datetime.timedelta(hours=tz)
            jd_prev_ut_sunrise = datetime_to_julian(prev_dt_utc_sunrise)

            # Get next day's sunrise for Smarta Kshaya rule logic
            next_dt_local = dt_local + datetime.timedelta(days=1)
            next_rise_time, _ = calculate_noaa_sunrise_sunset(next_dt_local.date(), lat, lon, tz)
            if next_rise_time:
                next_sunrise_dt = next_rise_time
            else:
                next_sunrise_dt = datetime.datetime.combine(next_dt_local.date(), datetime.time(6, 0))
            
            next_dt_utc_sunrise = next_sunrise_dt - datetime.timedelta(hours=tz)
            jd_next_ut_sunrise = datetime_to_julian(next_dt_utc_sunrise)

            tithi = compute_tithi(jd_ut_sunrise)
            nakshatra = compute_nakshatra(jd_ut_sunrise)
            yoga = compute_yoga(jd_ut_sunrise)
            karana = compute_karana(jd_ut_sunrise)
            day_name = get_day_name(dt_local)

            muhurtas = calculate_muhurta_periods(sunrise_dt, sunset_dt)
            is_adhik = check_adhik_maas(jd_ut_sunrise)
            
            # Strict Ekadashi Fasting Logic (Vaishnava)
            ekadashi_vrat_type = check_ekadashi_vrat(jd_ut_sunrise, jd_prev_ut_sunrise)
            
            # Smarta Ekadashi Fasting Logic
            smarta_ekadashi_vrat_type = check_smarta_ekadashi_vrat(jd_ut_sunrise, jd_prev_ut_sunrise, jd_next_ut_sunrise)
            
            ekadashi_start = None
            ekadashi_end = None
            if ekadashi_vrat_type:
                target_tithi = 10 if ekadashi_vrat_type == "Shukla" else 25
                search_jd = jd_ut_sunrise
                for offset in [0, -0.5, -1.0, -1.5, -2.0]:
                    if compute_tithi(search_jd + offset)["tithi_index"] == target_tithi:
                        search_jd += offset
                        break
                st_jd, en_jd = get_tithi_boundaries(search_jd)
                st_dt = julian_to_datetime(st_jd) + datetime.timedelta(hours=tz)
                en_dt = julian_to_datetime(en_jd) + datetime.timedelta(hours=tz)
                ekadashi_start = st_dt.strftime("%I:%M %p, %d %b")
                ekadashi_end = en_dt.strftime("%I:%M %p, %d %b")

            # Calculate Nakshatra start and end times
            nak_st_jd, nak_en_jd = get_nakshatra_boundaries(jd_ut_sunrise)
            nak_st_dt = julian_to_datetime(nak_st_jd) + datetime.timedelta(hours=tz)
            nak_en_dt = julian_to_datetime(nak_en_jd) + datetime.timedelta(hours=tz)
            nakshatra_start = nak_st_dt.strftime("%I:%M %p, %d %b")
            nakshatra_end = nak_en_dt.strftime("%I:%M %p, %d %b")

            monthly_data.append({
                "day_number": day,
                "date": dt_local.strftime("%Y-%m-%d"),
                "day": day_name,
                "tithi": tithi,
                "nakshatra": nakshatra,
                "yoga": yoga,
                "karana": karana,
                "muhurtas": muhurtas,
                "sun_rise": sunrise_dt.strftime("%I:%M %p"),
                "sun_set": sunset_dt.strftime("%I:%M %p"),
                "is_adhik_maas": is_adhik,
                "ekadashi_vrat_type": ekadashi_vrat_type,
                "smarta_ekadashi_vrat_type": smarta_ekadashi_vrat_type,
                "ekadashi_start": ekadashi_start,
                "ekadashi_end": ekadashi_end,
                "nakshatra_start": nakshatra_start,
                "nakshatra_end": nakshatra_end
            })

        return {"year": year, "month": month, "data": monthly_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/next-adhik-maas")
async def get_next_adhik_maas():
    """
    Finds the upcoming Adhik Maas starting from the current date.
    """
    try:
        dt_local = datetime.datetime.now()
        dt_utc = dt_local - datetime.timedelta(hours=5.5) # Default to IST approximation for global search
        jd_ut = datetime_to_julian(dt_utc)
        
        jd_purnima = find_next_adhik_maas(jd_ut)
        if not jd_purnima:
            return {"found": False}
            
        dt_purnima_utc = julian_to_datetime(jd_purnima)
        dt_purnima_local = dt_purnima_utc + datetime.timedelta(hours=5.5)
        
        # Get the nakshatra of this Purnima to determine the Hindu Month name
        nakshatra = compute_nakshatra(jd_purnima)
        
        return {
            "found": True,
            "date": dt_purnima_local.strftime("%B %Y"),
            "nakshatra_name": nakshatra["nakshatra_name"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from panchang.choghadiya_oracle import analyze_choghadiya_question

@router.post("/choghadiya-oracle")
async def ask_choghadiya_oracle(request: ChoghadiyaOracleRequest):
    """
    Provides Vedic Oracle advice based on the currently active Choghadiya.
    """
    try:
        # Determine the active Choghadiya based on the current system time
        now = datetime.datetime.now()
        current_time_str = now.strftime("%I:%M %p")
        
        active_choghadiya_name = None
        
        # Helper to parse "HH:MM AM/PM" to datetime for today
        def parse_time(time_str):
            try:
                t = datetime.datetime.strptime(time_str, "%I:%M %p").time()
                return datetime.datetime.combine(now.date(), t)
            except Exception:
                return None
        
        # Find active in Day or Night array
        all_choghadiyas = request.choghadiya_data.get("day", []) + request.choghadiya_data.get("night", [])
        
        for ch in all_choghadiyas:
            st = parse_time(ch.get("start", ""))
            en = parse_time(ch.get("end", ""))
            if st and en:
                # Handle midnight crossing
                if en < st:
                    en += datetime.timedelta(days=1)
                
                compare_now = now
                if compare_now < st and (en - st).total_seconds() > 0 and compare_now.hour < 12 and st.hour > 12:
                    # if now is 1 AM but start was 11 PM
                    compare_now += datetime.timedelta(days=1)
                    
                if st <= compare_now <= en:
                    active_choghadiya_name = ch.get("name")
                    break
        
        if not active_choghadiya_name:
            # Fallback if parsing fails
            active_choghadiya_name = all_choghadiyas[0]["name"] if all_choghadiyas else "Amrit"
            
        result = analyze_choghadiya_question(active_choghadiya_name, request.question)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

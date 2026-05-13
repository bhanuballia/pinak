from fastapi import APIRouter, Query, HTTPException
from typing import Optional
import datetime
from astronomy.julian import datetime_to_julian, julian_to_datetime
from panchang.tithi_yoga_karana import compute_tithi, compute_nakshatra, compute_yoga, compute_karana
from core.utils import ZODIAC_SIGNS, get_sign_index

router = APIRouter()

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

    return {
        "rahu_kaal": {"start": rahu_start.strftime("%I:%M %p"), "end": rahu_end.strftime("%I:%M %p")},
        "abhijit": {"start": abhijit_start.strftime("%I:%M %p"), "end": abhijit_end.strftime("%I:%M %p")}
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

        # Approximate Sunrise/Sunset for Muhurta calculations
        # In a production app, we'd use a precise rise/set library.
        # Fallback to 6:00 AM / 6:00 PM for UI testing if not computed.
        sunrise_dt = datetime.datetime.combine(dt_local.date(), datetime.time(6, 0))
        sunset_dt = datetime.datetime.combine(dt_local.date(), datetime.time(18, 0))
        
        muhurtas = calculate_muhurta_periods(sunrise_dt, sunset_dt)
        vedic_time = calculate_vedic_time(dt_local, sunrise_dt)

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
            "sun_set": sunset_dt.strftime("%I:%M %p")
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

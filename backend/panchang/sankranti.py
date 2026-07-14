import swisseph as swe
from typing import Optional, Dict
from astronomy.julian import datetime_to_julian, julian_to_datetime
from astronomy.positions import FLAGS, set_ayanamsa
import datetime

# The 12 Sidereal Zodiac Signs (Rashis)
RASHI_NAMES = [
    "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", 
    "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)", 
    "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)", 
    "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"
]

def check_daily_sankranti(dt_local: datetime.datetime, tz: float) -> Optional[Dict[str, str]]:
    """
    Checks if a Lahiri Sankranti (Solar transit) occurs during the given local day.
    Returns None if no transit occurs.
    """
    if swe is None:
        return None

    # Define the start and end of the local day
    start_of_day_local = datetime.datetime.combine(dt_local.date(), datetime.time.min)
    end_of_day_local = start_of_day_local + datetime.timedelta(days=1)

    # Convert to UTC
    start_of_day_utc = start_of_day_local - datetime.timedelta(hours=tz)
    end_of_day_utc = end_of_day_local - datetime.timedelta(hours=tz)

    jd_start_utc = datetime_to_julian(start_of_day_utc)
    jd_end_utc = datetime_to_julian(end_of_day_utc)

    # Ensure Sidereal Mode is active
    set_ayanamsa()
    flags = FLAGS | swe.FLG_SIDEREAL

    # Calculate Sun's position at start of day
    try:
        res = swe.calc_ut(jd_start_utc, swe.SUN, flags)
        lon_start = res[0][0]
    except Exception as exc:
        return None

    # Determine current Rashi
    current_rashi_idx = int(lon_start / 30.0) % 12
    
    # Target longitude is the boundary of the next Rashi
    target_longitude = ((current_rashi_idx + 1) * 30.0) % 360.0

    # Find the exact Julian Date when Sun crosses this longitude
    try:
        jd_cross_utc = swe.solcross_ut(target_longitude, jd_start_utc, flags)
    except Exception as exc:
        return None

    # Does this crossing happen within our current local day?
    if jd_start_utc <= jd_cross_utc < jd_end_utc:
        # It's a Sankranti day!
        cross_dt_utc = julian_to_datetime(jd_cross_utc)
        cross_dt_local = cross_dt_utc + datetime.timedelta(hours=tz)
        
        next_rashi_idx = (current_rashi_idx + 1) % 12
        rashi_name = RASHI_NAMES[next_rashi_idx]
        
        sankranti_name = rashi_name.split(' ')[0] + " Sankranti"
        
        return {
            "name": sankranti_name,
            "rashi": rashi_name,
            "exact_time": cross_dt_local.strftime("%I:%M %p")
        }
        
    return None

def get_sankranti_for_month(year: int, month: int, tz: float) -> Optional[Dict[str, str]]:
    """
    Calculates the exact Sankranti that occurs within the given calendar month.
    Since Sun transits ~once every 30 days, there is exactly one transit per calendar month
    (typically between the 13th and 16th).
    """
    if swe is None:
        return None

    # Start at the 1st of the month
    dt_local = datetime.datetime(year, month, 1, 0, 0)
    dt_utc = dt_local - datetime.timedelta(hours=tz)
    jd_start_utc = datetime_to_julian(dt_utc)

    set_ayanamsa()
    flags = FLAGS | swe.FLG_SIDEREAL

    # Calculate Sun's position at start of month
    try:
        res = swe.calc_ut(jd_start_utc, swe.SUN, flags)
        lon_start = res[0][0]
    except Exception:
        return None

    current_rashi_idx = int(lon_start / 30.0) % 12
    target_longitude = ((current_rashi_idx + 1) * 30.0) % 360.0

    try:
        jd_cross_utc = swe.solcross_ut(target_longitude, jd_start_utc, flags)
    except Exception:
        return None

    cross_dt_utc = julian_to_datetime(jd_cross_utc)
    cross_dt_local = cross_dt_utc + datetime.timedelta(hours=tz)
    
    # We only return it if it truly falls in the requested month.
    if cross_dt_local.month == month:
        next_rashi_idx = (current_rashi_idx + 1) % 12
        rashi_name = RASHI_NAMES[next_rashi_idx]
        sankranti_name = rashi_name.split(' ')[0] + " Sankranti"
        
        return {
            "name": sankranti_name,
            "rashi": rashi_name,
            "date": cross_dt_local.strftime("%d %b %Y"),
            "exact_time": cross_dt_local.strftime("%I:%M %p")
        }
    
    return None

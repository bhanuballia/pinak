import math
import datetime
from astronomy.julian import datetime_to_julian
from astronomy.ascendant import get_ascendant_from_datetime
from astronomy.positions import get_all_planetary_positions
from astronomy.sun_calculations import calculate_noaa_sunrise_sunset

SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]

def get_sign_index(lon: float) -> int:
    return int(lon // 30) % 12

def get_sign_name(lon: float) -> str:
    return SIGNS[get_sign_index(lon)]

def evaluate_ashtamangala(jd_ut: float, now_utc: datetime.datetime, lat: float, lon: float, arudha_sign_name: str, question: str):
    arudha_idx = SIGNS.index(arudha_sign_name) if arudha_sign_name in SIGNS else 0
    arudha_sign = SIGNS[arudha_idx]
    
    asc_info = get_ascendant_from_datetime(now_utc, lat, lon)
    udaya_lon = asc_info.get("ascendant_degree", 0.0)
    udaya_idx = get_sign_index(udaya_lon)
    udaya_sign = SIGNS[udaya_idx]
    
    planets = get_all_planetary_positions(jd_ut)
    sun_lon = planets["Sun"]["sidereal"]["lon"]
    sun_idx = get_sign_index(sun_lon)
    sun_sign = SIGNS[sun_idx]
    
    count_sun_to_udaya = (udaya_idx - sun_idx) % 12
    chhatra_idx = (arudha_idx + count_sun_to_udaya) % 12
    chhatra_sign = SIGNS[chhatra_idx]
    
    date = now_utc.date()
    tz_offset = lon / 15.0
    sunrise, sunset = calculate_noaa_sunrise_sunset(date, lat, lon, tz_offset)
    
    if not sunrise or not sunset:
        sunrise = now_utc.replace(hour=6, minute=0, second=0)
        sunset = now_utc.replace(hour=18, minute=0, second=0)
        
    is_daytime = sunrise <= now_utc < sunset
    weekday = now_utc.weekday()
    vedic_weekday = (weekday + 1) % 7
    
    mandi_day_parts = [6, 5, 4, 3, 2, 1, 0]
    mandi_night_parts = [2, 1, 0, 6, 5, 4, 3]
    
    mandi_part = mandi_day_parts[vedic_weekday] if is_daytime else mandi_night_parts[vedic_weekday]
    gulika_part = (mandi_part - 1) % 7
    
    if is_daytime:
        duration = (sunset - sunrise).total_seconds()
        part_len = duration / 8
        mandi_time = sunrise + datetime.timedelta(seconds=mandi_part * part_len)
        gulika_time = sunrise + datetime.timedelta(seconds=gulika_part * part_len)
    else:
        next_date = date + datetime.timedelta(days=1)
        next_sunrise, _ = calculate_noaa_sunrise_sunset(next_date, lat, lon, tz_offset)
        if not next_sunrise: next_sunrise = sunset + datetime.timedelta(hours=12)
        duration = (next_sunrise - sunset).total_seconds()
        part_len = duration / 8
        mandi_time = sunset + datetime.timedelta(seconds=mandi_part * part_len)
        gulika_time = sunset + datetime.timedelta(seconds=gulika_part * part_len)
        
    mandi_asc = get_ascendant_from_datetime(mandi_time, lat, lon).get("ascendant_degree", 0.0)
    gulika_asc = get_ascendant_from_datetime(gulika_time, lat, lon).get("ascendant_degree", 0.0)
    
    mandi_sign = get_sign_name(mandi_asc)
    gulika_sign = get_sign_name(gulika_asc)
    
    reasons = []
    score = 0
    
    if gulika_sign == arudha_sign or mandi_sign == arudha_sign:
        score -= 2
        reasons.append(f"Gulika/Mandi is in the Arudha Lagna ({arudha_sign}), indicating hidden obstacles, delays, or health concerns related to the query.")
    
    if chhatra_sign == arudha_sign:
        score += 2
        reasons.append(f"The Chhatra falls on the Arudha Lagna ({arudha_sign}), offering strong divine protection and success.")
        
    if not reasons:
        reasons.append("The omens are neutral. No major afflictions from Gulika/Mandi to the Arudha.")
        
    reasoning_text = " ".join(reasons)
    
    return {
        "arudha_sign": arudha_sign,
        "udaya_sign": udaya_sign,
        "sun_sign": sun_sign,
        "chhatra_sign": chhatra_sign,
        "gulika_sign": gulika_sign,
        "mandi_sign": mandi_sign,
        "score": score,
        "reasoning": reasoning_text,
        "gulika_lon": gulika_asc,
        "mandi_lon": mandi_asc,
        "udaya_lon": udaya_lon,
        "planets": planets
    }

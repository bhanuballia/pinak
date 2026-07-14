import datetime
from astronomy.julian import julian_to_datetime
from panchang.tithi_yoga_karana import (
    compute_tithi,
    compute_nakshatra,
    compute_yoga,
    compute_karana,
    compute_sunrise_sunset_for_date
)
from matchmaking.guna_milan.nakshatra_data import NAKSHATRA_ATTRIBUTES
from astronomy.positions import get_all_planetary_positions
from dasha_engine.vimshottari_balance import VimshottariBalanceCalculator
from dasha_engine.mahadasha import VIMSHOTTARI_SEQUENCE
import swisseph as swe

SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"]

def format_balance(remaining_years):
    years = int(remaining_years)
    rem_months = (remaining_years - years) * 12
    months = int(rem_months)
    days = int((rem_months - months) * 30)
    return f"{years}y {months}m {days}d"

def calculate_ishtkaal(event_local: datetime.datetime, sunrise_local_str: str):
    if not sunrise_local_str:
        return ""
    try:
        sunrise = datetime.datetime.fromisoformat(sunrise_local_str)
    except ValueError:
        return ""
        
    diff = event_local - sunrise
    total_seconds = diff.total_seconds()
    if total_seconds < 0:
        total_seconds += 86400  # approx if before sunrise
    
    ghatis_total = total_seconds / 3600.0 * 2.5
    ghatis = int(ghatis_total)
    pals = int((ghatis_total - ghatis) * 60)
    vipals = int((((ghatis_total - ghatis) * 60) - pals) * 60)
    return f"{ghatis}:{pals}:{vipals} ghatis"

def calculate_paya(ascendant_sign_idx, moon_sign_idx):
    count = (moon_sign_idx - ascendant_sign_idx) % 12 + 1
    if count in [1, 6, 11]:
        return "Gold"
    elif count in [2, 5, 9]:
        return "Silver"
    elif count in [3, 7, 10]:
        return "Copper"
    else:
        return "Iron"

def get_full_astrological_details(jd_ut: float, lat: float, lon: float, tz_offset: float):
    dt_utc = julian_to_datetime(jd_ut)
    dt_local = dt_utc + datetime.timedelta(hours=tz_offset)
    
    pos = get_all_planetary_positions(jd_ut)
    
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    cusps, ascmc = swe.houses_ex(jd_ut, lat, lon, b'W', swe.FLG_SIDEREAL)
    asc_deg = ascmc[0]
    asc_sign_idx = int(asc_deg / 30)
    
    moon_lon = float(pos["Moon"]["sidereal"]["lon"])
    moon_sign_idx = int(moon_lon / 30)
    
    sun_lon_tropical = float(pos["Sun"]["tropical"]["lon"])
    sun_sign_idx = int(sun_lon_tropical / 30)
    
    ayanamsha = swe.get_ayanamsa_ut(jd_ut)
    
    # Panchang
    tithi_data = compute_tithi(jd_ut)
    nak_data = compute_nakshatra(jd_ut)
    yoga_data = compute_yoga(jd_ut)
    karana_data = compute_karana(jd_ut)
    sunrise_data = compute_sunrise_sunset_for_date(dt_local.date(), lat, lon, tz_offset)
    
    nak_name = nak_data["nakshatra_name"]
    nak_attrs = NAKSHATRA_ATTRIBUTES.get(nak_name, {})
    nak_lord = nak_attrs.get("lord", "")
    
    # Balance of Dasha
    planet_years = dict(VIMSHOTTARI_SEQUENCE).get(nak_lord, 0)
    calc = VimshottariBalanceCalculator()
    rem_years = calc.calculate_balance(moon_lon, nak_name, planet_years)
    dasha_balance = f"{nak_lord} {format_balance(rem_years)}"
    
    ishtkaal = calculate_ishtkaal(dt_local, sunrise_data["sunrise_local"])
    paya_rashi = calculate_paya(asc_sign_idx, moon_sign_idx)
    
    def format_time_only(iso_str):
        if not iso_str: return ""
        try:
            return datetime.datetime.fromisoformat(iso_str).strftime("%H:%M:%S hrs.")
        except:
            return iso_str

    def format_ayanamsha(deg_val):
        d = int(deg_val)
        m = int((deg_val - d) * 60)
        s = int((((deg_val - d) * 60) - m) * 60)
        return f"-{d}:{m}:{s} Lahiri"

    return {
        "date_of_birth": dt_local.strftime("%d %B %Y"),
        "day_of_birth": dt_local.strftime("%A"),
        "time_of_birth": dt_local.strftime("%H:%M:%S hrs."),
        "ishtkaal": ishtkaal,
        "latitude": f"{lat:.2f}",
        "longitude": f"{lon:.2f}",
        "time_zone": f"{tz_offset:+.2f} hrs",
        "war_daylight_corr": "00:00:00 hrs",
        "ayanamsha": format_ayanamsha(ayanamsha),
        "sunrise_time": format_time_only(sunrise_data["sunrise_local"]),
        "sunset_time": format_time_only(sunrise_data["sunset_local"]),
        
        "lagna": SIGNS[asc_sign_idx],
        "lagnesh": SIGN_LORDS[asc_sign_idx],
        "rashi": SIGNS[moon_sign_idx],
        "rashish": SIGN_LORDS[moon_sign_idx],
        "nakshatra": nak_name,
        "nakshatra_lord": nak_lord,
        "pada": str(nak_data["pada"]),
        "yoga": yoga_data["yoga_name"],
        "tithi": tithi_data["tithi_name"].replace(" Paksha - Tithi ", " "),
        "karana": karana_data["karana_name"],
        
        "varna": nak_attrs.get("varna", ""),
        "vashya": nak_attrs.get("vashya", ""),
        "yoni": nak_attrs.get("yoni", ""),
        "gana": nak_attrs.get("gana", ""),
        "nadi": nak_attrs.get("nadi", ""),
        "varga": "Udara", # Fixed placeholder since varga isn't widely calculated
        
        "naamakshar": "-", # Simplified
        "paya_rashi": paya_rashi,
        "paya_nakshatra": paya_rashi, # Simplified fallback
        "sunsign_western": SIGNS[sun_sign_idx],
        
        "balance_of_dasha": dasha_balance
    }

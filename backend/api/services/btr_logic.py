from datetime import datetime, timedelta
from astronomy.julian import datetime_to_julian
from astronomy.ascendant import get_ascendant_from_datetime
from astronomy.positions import get_all_planetary_positions
from charts.rashi_chart import build_rashi_chart
from dasha.vimshottari import compute_vimshottari_full

MALE_SIGNS = ["Aries", "Gemini", "Leo", "Libra", "Sagittarius", "Aquarius"]
FEMALE_SIGNS = ["Taurus", "Cancer", "Virgo", "Scorpio", "Capricorn", "Pisces"]

EVENT_HOUSE_MAP = {
    "Marriage": 7,
    "Career": 10,
    "Job": 10,
    "Child": 5,
    "Property": 4,
    "Relocation": 12,
    "Foreign Travel": 12,
    "Education": 9,
    "Wealth": 2,
    "Illness": 6,
    "Injury": 8
}

def find_active_dasha(dashas, event_date_str, birth_year):
    try:
        event_dt = datetime.strptime(event_date_str, "%Y-%m-%d")
        event_year = event_dt.year + (event_dt.month / 12.0) + (event_dt.day / 365.25)
    except:
        return None, None

    for md in dashas:
        start = md.get("start_age", 0) + birth_year
        end = start + md.get("duration", 0)
        if start <= event_year <= end:
            ad_list = md.get("antardashas", [])
            for ad in ad_list:
                ad_start = ad.get("start_age", 0) + birth_year
                ad_end = ad_start + ad.get("duration", 0)
                if ad_start <= event_year <= ad_end:
                    return md.get("planet"), ad.get("planet")
            return md.get("planet"), None
    return None, None

def calculate_btr(date_str, lat, lon, start_time_str, end_time_str, gender, life_events):
    dt_start = datetime.strptime(f"{date_str} {start_time_str}", "%Y-%m-%d %H:%M")
    dt_end = datetime.strptime(f"{date_str} {end_time_str}", "%Y-%m-%d %H:%M")
    
    if (dt_end - dt_start).total_seconds() > 10800:
        dt_end = dt_start + timedelta(hours=3)
        
    birth_year = dt_start.year + (dt_start.month / 12.0) + (dt_start.day / 365.25)
        
    best_score = -9999
    best_time = None
    best_chart = None
    
    current_time = dt_start
    while current_time <= dt_end:
        jd_ut = datetime_to_julian(current_time)
        asc_info = get_ascendant_from_datetime(current_time, float(lat), float(lon))
        asc_sign = asc_info.get("ascendant_sign", "Aries")
        
        score = 0
        if gender.lower() == "male" and asc_sign in MALE_SIGNS:
            score += 10
        elif gender.lower() == "female" and asc_sign in FEMALE_SIGNS:
            score += 10
            
        chart = build_rashi_chart(jd_ut, float(lat), float(lon))
        all_planets = get_all_planetary_positions(jd_ut)
        moon_lon = all_planets.get("Moon", {}).get("sidereal", {}).get("lon", 0)
        
        dashas = compute_vimshottari_full(jd_ut, moon_lon, years_ahead=100)
        
        for event in life_events:
            event_type = event.get("type", "")
            event_date = event.get("date", "")
            target_house = EVENT_HOUSE_MAP.get(event_type, 1)
            
            md_lord, ad_lord = find_active_dasha(dashas, event_date, birth_year)
            
            house_data = chart.get("houses", {}).get(target_house, {})
            ruling_lord = house_data.get("lord", "")
            planets_in_house = [p.get("name") for p in house_data.get("planets", [])]
            
            if md_lord == ruling_lord:
                score += 15
            if ad_lord == ruling_lord:
                score += 20
                
            if md_lord in planets_in_house:
                score += 5
            if ad_lord in planets_in_house:
                score += 10

        if score > best_score:
            best_score = score
            best_time = current_time
            best_chart = chart
            
        current_time += timedelta(minutes=1)
        
    return {
        "rectified_time": best_time.strftime("%H:%M") if best_time else None,
        "rectified_datetime": best_time.isoformat() if best_time else None,
        "score": best_score,
        "chart": best_chart
    }

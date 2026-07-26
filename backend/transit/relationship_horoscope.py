# backend/transit/relationship_horoscope.py
import datetime as _dt
from typing import Dict, Any, List
from astronomy.julian import datetime_to_julian
from astronomy.positions import get_all_planetary_positions
from charts.rashi_chart import build_rashi_chart
from api.astrology_compatibility import get_moon_sign_compatibility
from api.numerology_calculator import (
    calculate_namank,
    calculate_life_path_number,
    get_compatibility_score,
    reduce_to_single_digit
)

SIGN_LORDS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

SIGN_LIST = list(SIGN_LORDS.keys())

def get_relative_house(natal_sign: str, transit_sign: str) -> int:
    try:
        natal_idx = SIGN_LIST.index(natal_sign)
        transit_idx = SIGN_LIST.index(transit_sign)
        return ((transit_idx - natal_idx) % 12) + 1
    except ValueError:
        return 1

def compute_natal_summary(birth_details: Dict[str, Any]) -> Dict[str, Any]:
    """Helper to generate natal positions for a partner."""
    date_str = birth_details["date"]
    time_str = birth_details["time"]
    tz_offset = float(birth_details.get("tz_offset", 5.5))
    lat = float(birth_details["lat"])
    lon = float(birth_details["lon"])
    
    y, m, d = [int(x) for x in date_str.split("-")]
    tp = [int(x) for x in time_str.split(":")]
    dt_local = _dt.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
    dt_utc = dt_local - _dt.timedelta(hours=tz_offset)
    jd_ut = datetime_to_julian(dt_utc)
    
    chart = build_rashi_chart(jd_ut, lat, lon, house_system="W", style="north")
    
    # Locate Moon sign and details
    planet_positions = chart.get("planet_positions", {})
    moon_data = planet_positions.get("Moon", {})
    moon_lon = moon_data.get("sidereal", {}).get("lon", 0.0)
    moon_sign = SIGN_LIST[int(moon_lon // 30) % 12]
    
    return {
        "name": birth_details.get("name", "Partner"),
        "moon_sign": moon_sign,
        "moon_lon": moon_lon,
        "chart": chart
    }

def calculate_weekly_relationship_horoscope(
    partner_a_details: Dict[str, Any],
    partner_b_details: Dict[str, Any],
    start_date_str: str
) -> Dict[str, Any]:
    # 1. Generate natal summaries
    natal_a = compute_natal_summary(partner_a_details)
    natal_b = compute_natal_summary(partner_b_details)
    
    # 2. Get baseline compatibility
    baseline_compatibility = get_moon_sign_compatibility(natal_a["moon_sign"], natal_b["moon_sign"])
    
    # 3. Parse starting date
    start_dt = _dt.datetime.strptime(start_date_str, "%Y-%m-%d")
    
    daily_forecasts = []
    
    # 4. Loop for 7 days
    for i in range(7):
        target_date = start_dt + _dt.timedelta(days=i)
        jd_ut = datetime_to_julian(target_date)
        transits = get_all_planetary_positions(jd_ut)
        
        # Get transit signs
        venus_lon = transits.get("Venus", {}).get("sidereal", {}).get("lon", 0.0)
        venus_sign = SIGN_LIST[int(venus_lon // 30) % 12]
            
        mars_lon = transits.get("Mars", {}).get("sidereal", {}).get("lon", 0.0)
        mars_sign = SIGN_LIST[int(mars_lon // 30) % 12]
            
        moon_lon = transits.get("Moon", {}).get("sidereal", {}).get("lon", 0.0)
        moon_sign = SIGN_LIST[int(moon_lon // 30) % 12]
            
        # Relative houses
        rel_venus_a = get_relative_house(natal_a["moon_sign"], venus_sign)
        rel_venus_b = get_relative_house(natal_b["moon_sign"], venus_sign)
        
        rel_mars_a = get_relative_house(natal_a["moon_sign"], mars_sign)
        rel_mars_b = get_relative_house(natal_b["moon_sign"], mars_sign)

        rel_moon_a = get_relative_house(natal_a["moon_sign"], moon_sign)
        rel_moon_b = get_relative_house(natal_b["moon_sign"], moon_sign)
        
        # Scoring Rules
        harmony_score = baseline_compatibility.get("score", 60)
        passion_score = 60
        communication_score = 65
        
        # Venus transits (harmony/love)
        if rel_venus_a in [1, 5, 7, 9, 11]: harmony_score += 10
        if rel_venus_b in [1, 5, 7, 9, 11]: harmony_score += 10
        if rel_venus_a in [6, 8, 12]: harmony_score -= 8
        if rel_venus_b in [6, 8, 12]: harmony_score -= 8
        
        # Mars transits (passion/chemistry/conflict)
        if rel_mars_a in [5, 7, 8]: passion_score += 15
        if rel_mars_b in [5, 7, 8]: passion_score += 15
        if rel_mars_a in [4, 12]: passion_score -= 10
        
        # Moon daily transits (individual transit impact & mood alignment)
        # Favorable transit Moon houses from natal Moon: 1, 3, 6, 7, 10, 11
        # Challenging houses: 4, 8, 12
        if rel_moon_a in [1, 3, 6, 7, 10, 11]:
            harmony_score += 6
            communication_score += 8
        elif rel_moon_a in [4, 8, 12]:
            harmony_score -= 8
            communication_score -= 6
            
        if rel_moon_b in [1, 3, 6, 7, 10, 11]:
            harmony_score += 6
            communication_score += 8
        elif rel_moon_b in [4, 8, 12]:
            harmony_score -= 8
            communication_score -= 6
            
        # Check alignment relative to each other
        if rel_moon_a == rel_moon_b:
            harmony_score += 8
            communication_score += 10
        elif abs(rel_moon_a - rel_moon_b) in [4, 8]:
            harmony_score += 5
        elif abs(rel_moon_a - rel_moon_b) in [6, 8]:
            harmony_score -= 8

        # Minor daily Moon influence on passion
        if rel_moon_a in [5, 7, 8]:
            passion_score += 6
        elif rel_moon_a in [4, 12]:
            passion_score -= 6
            
        harmony_score = min(100, max(15, harmony_score))
        passion_score = min(100, max(15, passion_score))
        communication_score = min(100, max(15, communication_score))
        
        avg_score = (harmony_score + passion_score + communication_score) / 3.0
        if avg_score > 75:
            advices = [
                "An incredibly harmonious day! Ideal for sharing deep moments, planning dates, and celebrating your connection.",
                "Planetary alignments favor romance and heart-to-heart connections. Express your feelings openly.",
                "A peak day for relationship harmony. Your energies flow beautifully together, making it perfect for quality time."
            ]
            advice = advices[(rel_moon_a + rel_moon_b) % len(advices)]
        elif avg_score >= 55:
            advices = [
                "A stable and supportive day. Minor fluctuations are easy to navigate through open, loving conversations.",
                "Average planetary harmony today. Keeping routines light and showing appreciation will maintain a warm atmosphere.",
                "Steady cosmic support. Focus on practical matters together and enjoy comfortable, quiet moments."
            ]
            advice = advices[(rel_moon_a + rel_moon_b) % len(advices)]
        else:
            advices = [
                "Planetary transits indicate a need for patience and space today. Avoid heavy discussions and practice empathy.",
                "Cosmic tensions might trigger minor misunderstandings. Take a breath and choose gentle words.",
                "A challenging day for communication. Give each other space and avoid bringing up past disagreements."
            ]
            advice = advices[(rel_moon_a + rel_moon_b) % len(advices)]
            
        daily_forecasts.append({
            "day_name": target_date.strftime("%A"),
            "date_string": target_date.strftime("%b %d"),
            "harmony_score": int(harmony_score),
            "passion_score": int(passion_score),
            "communication_score": int(communication_score),
            "advice": advice
        })
        
    return {
        "partner_a_name": natal_a["name"],
        "partner_b_name": natal_b["name"],
        "partner_a_sign": natal_a["moon_sign"],
        "partner_b_sign": natal_b["moon_sign"],
        "baseline_compatibility_score": baseline_compatibility.get("score", 60),
        "baseline_message": baseline_compatibility.get("message", ""),
        "weekly_data": daily_forecasts
    }

def calculate_weekly_numerology_horoscope(
    name_a: str,
    dob_a: str,
    name_b: str,
    dob_b: str,
    start_date_str: str
) -> Dict[str, Any]:
    # 1. Core numerology values
    namank_a = calculate_namank(name_a)
    namank_b = calculate_namank(name_b)
    lpn_a = calculate_life_path_number(dob_a)
    lpn_b = calculate_life_path_number(dob_b)
    
    # 2. Get baseline compatibility based on Names (Namank)
    baseline_compatibility = get_compatibility_score(namank_a, namank_b)
    
    # 3. Parse starting date
    start_dt = _dt.datetime.strptime(start_date_str, "%Y-%m-%d")
    
    daily_forecasts = []
    
    # Numerology relationship matrix
    friends = {
        1: [2, 3, 9], 2: [1, 3], 3: [1, 2, 9], 4: [5, 6, 7],
        5: [1, 4, 6], 6: [3, 5, 8], 7: [4, 5, 6], 8: [5, 6], 9: [1, 3, 7]
    }
    enemies = {
        1: [8], 2: [5, 8], 3: [5, 6], 4: [8],
        5: [2, 3], 6: [1, 2], 7: [1, 2], 8: [1, 2, 4], 9: [4, 8]
    }
    
    # 4. Loop for 7 days
    for i in range(7):
        target_date = start_dt + _dt.timedelta(days=i)
        
        # Calculate Personal Days
        py_a = reduce_to_single_digit(lpn_a + target_date.year)
        pm_a = reduce_to_single_digit(py_a + target_date.month)
        pd_a = reduce_to_single_digit(pm_a + target_date.day)
        
        py_b = reduce_to_single_digit(lpn_b + target_date.year)
        pm_b = reduce_to_single_digit(py_b + target_date.month)
        pd_b = reduce_to_single_digit(pm_b + target_date.day)
        
        # Daily scores
        harmony_score = baseline_compatibility.get("score", 60)
        passion_score = 65
        communication_score = 70
        
        # Compare Personal Day Numbers
        if pd_b in friends.get(pd_a, []):
            harmony_score += 15
            communication_score += 15
            passion_score += 12
        elif pd_b in enemies.get(pd_a, []):
            harmony_score -= 15
            communication_score -= 10
            passion_score -= 12
        else:
            harmony_score += 5  # Neutral compatibility
            passion_score += 5
            
        # Add slight variations based on Life Path Numbers
        if lpn_a == lpn_b:
            harmony_score += 8
            
        # Add deterministic daily variations to avoid identical consecutive days in same category
        day_variation = (pd_a * 2 + pd_b) % 7 - 3  # will yield -3 to 3
        harmony_score += day_variation
        passion_score += ((pd_a + pd_b * 3) % 5) - 2
        communication_score += ((pd_a * 3 + pd_b) % 5) - 2
        
        harmony_score = min(100, max(15, harmony_score))
        passion_score = min(100, max(15, passion_score))
        communication_score = min(100, max(15, communication_score))
        
        avg_score = (harmony_score + passion_score + communication_score) / 3.0
        if avg_score > 75:
            advices = [
                "Excellent alignment of path cycles! Mutual understanding reaches peak today.",
                "Highly auspicious vibes. A perfect time to share aspirations and strengthen bonds.",
                "Beautiful resonance of energies! Collaborative efforts and joint planning are highly favored."
            ]
            advice = f"Day under Personal Day {pd_a} & {pd_b} energy. " + advices[(pd_a + pd_b) % len(advices)]
        elif avg_score >= 55:
            advices = [
                "Stable day. Clear communication helps bridge any minor cycle gaps.",
                "Steady energy. Focus on daily routines and supportive conversations.",
                "Harmonious flow. A good day to express appreciation for each other."
            ]
            advice = f"Day under Personal Day {pd_a} & {pd_b} energy. " + advices[(pd_a + pd_b) % len(advices)]
        else:
            advices = [
                "Conflicting numbers indicate potential misunderstandings. Listen more, speak less.",
                "Planetary/cycle friction suggests keeping discussions light. Practice patience.",
                "Energy cycles advise giving each other space today. Avoid forcing joint activities."
            ]
            advice = f"Day under Personal Day {pd_a} & {pd_b} energy. " + advices[(pd_a + pd_b) % len(advices)]
            
        daily_forecasts.append({
            "day_name": target_date.strftime("%A"),
            "date_string": target_date.strftime("%b %d"),
            "harmony_score": int(harmony_score),
            "passion_score": int(passion_score),
            "communication_score": int(communication_score),
            "advice": advice
        })
        
    return {
        "partner_a_name": name_a,
        "partner_b_name": name_b,
        "partner_a_sign": f"Namank {namank_a}",
        "partner_b_sign": f"Namank {namank_b}",
        "baseline_compatibility_score": baseline_compatibility.get("score", 60),
        "baseline_message": baseline_compatibility.get("message", ""),
        "weekly_data": daily_forecasts
    }

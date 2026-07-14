# matchmaking/risk_analysis/upapada_lagna.py
from typing import Dict, Any

ZODIAC_LORDS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

FASTING_DAYS = {
    "Sun": "Sunday",
    "Moon": "Monday",
    "Mars": "Tuesday",
    "Mercury": "Wednesday",
    "Jupiter": "Thursday",
    "Venus": "Friday",
    "Saturn": "Saturday"
}

def get_house_offset(start_h: int, end_h: int) -> int:
    """Inclusive distance from start_h to end_h."""
    dist = (end_h - start_h) % 12
    return dist + 1

def add_houses(start_h: int, offset: int) -> int:
    """Adds offset (inclusive logic) to start_h."""
    res = (start_h + offset - 1) % 12
    if res == 0: res = 12
    return res

def _get_planet_positions(chart: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
    positions = {}
    for h_num, h_data in chart.get("houses", {}).items():
        if not isinstance(h_data, dict): continue
        for p in h_data.get("planets", []):
            p_name = p.get("name") if isinstance(p, dict) else p
            positions[p_name] = {
                "house": int(h_num),
                "sign": h_data.get("sign_name", h_data.get("sign", ""))
            }
    return positions

def calculate_ul(chart: Dict[str, Any]) -> Dict[str, Any]:
    """Calculates the Upapada Lagna (Arudha of the 12th house)."""
    houses = chart.get("houses", {})
    if not houses: return {}
    
    twelfth_house = houses.get(12) or houses.get("12", {})
    if not isinstance(twelfth_house, dict): return {}
    
    twelfth_sign = twelfth_house.get("sign_name", twelfth_house.get("sign", ""))
    lord = ZODIAC_LORDS.get(twelfth_sign, "")
    
    positions = _get_planet_positions(chart)
    if lord not in positions:
        return {} # Lord missing
        
    lord_house = positions[lord]["house"]
    
    # Distance from 12th house to Lord's house
    dist = get_house_offset(12, lord_house)
    
    # UL is 'dist' houses away from Lord's house
    ul_house = add_houses(lord_house, dist)
    
    # Jaimini Exceptions:
    # If Arudha falls in the original house (12th), it moves to the 10th from it (9th house).
    if ul_house == 12:
        ul_house = 9
    # If Arudha falls in the 7th from original (6th house), it moves to 10th from it (3rd house).
    elif ul_house == 6:
        ul_house = 3
        
    ul_house_data = houses.get(ul_house) or houses.get(str(ul_house), {})
    ul_sign = ul_house_data.get("sign_name", ul_house_data.get("sign", "")) if isinstance(ul_house_data, dict) else ""
    
    # 2nd house from UL (Sustenance of marriage)
    second_from_ul = add_houses(ul_house, 2)
    second_house_data = houses.get(second_from_ul) or houses.get(str(second_from_ul), {})
    second_sign = second_house_data.get("sign_name", second_house_data.get("sign", "")) if isinstance(second_house_data, dict) else ""
    
    # Planets in 2nd from UL
    planets_in_2nd = []
    if isinstance(second_house_data, dict):
        for p in second_house_data.get("planets", []):
            p_name = p.get("name") if isinstance(p, dict) else p
            planets_in_2nd.append(p_name)
            
    # Fasting remedy usually corresponds to the Lord of the 2nd from UL
    lord_of_2nd = ZODIAC_LORDS.get(second_sign, "")
    day = FASTING_DAYS.get(lord_of_2nd, "Unknown")
    remedy = f"Fasting on {day} (Lord {lord_of_2nd} of the 2nd house from UL) is recommended to sustain and protect the marriage."
    
    return {
        "ul_house": ul_house,
        "ul_sign": ul_sign,
        "second_from_ul_house": second_from_ul,
        "second_from_ul_sign": second_sign,
        "planets_in_2nd_from_ul": planets_in_2nd,
        "remedy": remedy
    }

def analyze_upapada_lagna(bride_chart: Dict[str, Any], groom_chart: Dict[str, Any]) -> Dict[str, Any]:
    b_ul = calculate_ul(bride_chart)
    g_ul = calculate_ul(groom_chart)
    
    if not b_ul or not g_ul:
        return {"status": "Unknown", "message": "Could not calculate Upapada Lagna."}
        
    b_sign = b_ul.get("ul_sign")
    g_sign = g_ul.get("ul_sign")
    
    score = 75
    relationship_desc = ""
    
    if b_sign and g_sign and b_sign in ZODIAC_SIGNS and g_sign in ZODIAC_SIGNS:
        b_idx = ZODIAC_SIGNS.index(b_sign)
        g_idx = ZODIAC_SIGNS.index(g_sign)
        
        dist = (g_idx - b_idx) % 12 + 1
        dist_rev = (b_idx - g_idx) % 12 + 1
        rel = f"{dist}/{dist_rev}"
        
        if rel in ["1/1", "7/7"]:
            score = 95
            relationship_desc = f"UL Relationship ({rel}): Excellent mutual understanding of marriage."
        elif rel in ["5/9", "9/5", "3/11", "11/3"]:
            score = 85
            relationship_desc = f"UL Relationship ({rel}): Harmonious approach to sustaining marriage."
        elif rel in ["2/12", "12/2", "6/8", "8/6"]:
            score = 45
            relationship_desc = f"UL Relationship ({rel}): Challenging compatibility at the foundational level of marriage. Remedies are highly advised."
        else:
            relationship_desc = f"UL Relationship ({rel}): Moderate compatibility."
            
    return {
        "compatibility_score": score,
        "description": relationship_desc,
        "bride": b_ul,
        "groom": g_ul
    }

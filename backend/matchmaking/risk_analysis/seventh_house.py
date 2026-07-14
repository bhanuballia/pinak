# matchmaking/risk_analysis/seventh_house.py
from typing import Dict, Any

ZODIAC_LORDS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

EXALTED_SIGNS = {
    "Sun": "Aries", "Moon": "Taurus", "Mars": "Capricorn", "Mercury": "Virgo",
    "Jupiter": "Cancer", "Venus": "Pisces", "Saturn": "Libra"
}

DEBILITATED_SIGNS = {
    "Sun": "Libra", "Moon": "Scorpio", "Mars": "Cancer", "Mercury": "Pisces",
    "Jupiter": "Capricorn", "Venus": "Virgo", "Saturn": "Aries"
}

MALEFICS = ["Saturn", "Rahu", "Ketu", "Mars", "Sun"]

def _get_planet_positions(chart: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
    positions = {}
    for h_num, h_data in chart.get("houses", {}).items():
        if not isinstance(h_data, dict): continue
        for p in h_data.get("planets", []):
            p_name = p.get("name") if isinstance(p, dict) else p
            positions[p_name] = {
                "house": int(h_num),
                "sign": h_data.get("sign", "")
            }
    return positions

def analyze_7th_house(chart: Dict[str, Any], chart_name: str, is_d9: bool = False) -> Dict[str, Any]:
    """Analyzes the 7th house and 7th Lord for a single chart."""
    if not chart:
        return {}
        
    houses = chart.get("houses", {})
    seventh_house = houses.get("7", {})
    if not isinstance(seventh_house, dict):
        return {}
        
    seventh_sign = seventh_house.get("sign", "")
    seventh_lord = ZODIAC_LORDS.get(seventh_sign, "")
    
    positions = _get_planet_positions(chart)
    
    # 7th house conjunctions (planets in 7th house)
    planets_in_7th = []
    malefics_in_7th = []
    for p in seventh_house.get("planets", []):
        p_name = p.get("name") if isinstance(p, dict) else p
        planets_in_7th.append(p_name)
        if p_name in MALEFICS:
            malefics_in_7th.append(p_name)
            
    # 7th Lord status
    lord_status = "Neutral"
    lord_house = None
    lord_sign = None
    lord_conjunctions = []
    malefics_conjunct_lord = []
    
    if seventh_lord and seventh_lord in positions:
        lord_pos = positions[seventh_lord]
        lord_house = lord_pos["house"]
        lord_sign = lord_pos["sign"]
        
        # Check Dignity
        if lord_sign == EXALTED_SIGNS.get(seventh_lord):
            lord_status = "Exalted (Excellent)"
        elif lord_sign == DEBILITATED_SIGNS.get(seventh_lord):
            lord_status = "Debilitated (Weak)"
        elif ZODIAC_LORDS.get(lord_sign) == seventh_lord:
            lord_status = "Own Sign (Strong)"
            
        # Check conjunctions with Lord
        lord_house_data = houses.get(str(lord_house), {})
        if isinstance(lord_house_data, dict):
            for p in lord_house_data.get("planets", []):
                p_name = p.get("name") if isinstance(p, dict) else p
                if p_name != seventh_lord:
                    lord_conjunctions.append(p_name)
                    if p_name in MALEFICS:
                        malefics_conjunct_lord.append(p_name)
                        
    # Very basic aspect calculation (Vedic aspects)
    malefic_aspects_on_7th = []
    malefic_aspects_on_lord = []
    
    for p_name, pos in positions.items():
        if p_name not in MALEFICS: continue
        h = pos["house"]
        aspects = [(h + 6) % 12 + 1] # 7th aspect (opposite)
        
        # Special aspects
        if p_name == "Saturn":
            aspects.extend([(h + 2) % 12 + 1, (h + 9) % 12 + 1]) # 3rd, 10th
        elif p_name == "Mars":
            aspects.extend([(h + 3) % 12 + 1, (h + 7) % 12 + 1]) # 4th, 8th
        elif p_name in ["Rahu", "Ketu"]:
            aspects.extend([(h + 4) % 12 + 1, (h + 8) % 12 + 1]) # 5th, 9th
            
        if 7 in aspects:
            malefic_aspects_on_7th.append(p_name)
        if lord_house and lord_house in aspects:
            malefic_aspects_on_lord.append(p_name)

    chart_type = "Navamsha (D-9)" if is_d9 else "Lagna (D-1)"
    
    score = 100
    if lord_status == "Debilitated (Weak)": score -= 20
    elif lord_status in ["Exalted (Excellent)", "Own Sign (Strong)"]: score += 20
    
    score -= (len(malefics_in_7th) * 15)
    score -= (len(malefics_conjunct_lord) * 10)
    score -= (len(malefic_aspects_on_7th) * 5)
    
    score = max(0, min(100, score))
    
    return {
        "person": chart_name,
        "chart_type": chart_type,
        "seventh_sign": seventh_sign,
        "seventh_lord": seventh_lord,
        "lord_dignity": lord_status,
        "malefics_in_7th": malefics_in_7th,
        "malefics_conjunct_lord": malefics_conjunct_lord,
        "malefic_aspects_on_7th": list(set(malefic_aspects_on_7th)),
        "malefic_aspects_on_lord": list(set(malefic_aspects_on_lord)),
        "strength_score": score,
        "is_afflicted": score < 60
    }

def perform_bhava_milan(bride_d1: Dict[str, Any], bride_d9: Dict[str, Any], groom_d1: Dict[str, Any], groom_d9: Dict[str, Any]) -> Dict[str, Any]:
    """
    Performs the 7th House & 7th Lord analysis across both D-1 and D-9 charts for both partners.
    """
    b_d1_analysis = analyze_7th_house(bride_d1, "Bride", False)
    b_d9_analysis = analyze_7th_house(bride_d9, "Bride", True)
    g_d1_analysis = analyze_7th_house(groom_d1, "Groom", False)
    g_d9_analysis = analyze_7th_house(groom_d9, "Groom", True)
    
    # Calculate overall bhava score
    scores = []
    for a in [b_d1_analysis, b_d9_analysis, g_d1_analysis, g_d9_analysis]:
        if a and "strength_score" in a:
            scores.append(a["strength_score"])
            
    avg_score = sum(scores) / len(scores) if scores else 50
    
    status = "Excellent"
    if avg_score < 40:
        status = "Highly Afflicted (Needs Remedies)"
    elif avg_score < 60:
        status = "Moderate (Some friction expected)"
    elif avg_score < 80:
        status = "Good"
        
    return {
        "bhava_milan_score": avg_score,
        "status": status,
        "bride": {
            "d1": b_d1_analysis,
            "d9": b_d9_analysis
        },
        "groom": {
            "d1": g_d1_analysis,
            "d9": g_d9_analysis
        }
    }

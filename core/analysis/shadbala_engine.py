# core/analysis/shadbala_engine.py
"""
Quantitative Shadbala and Planetary Strength Engine.
Computes Positional (Sthana), Directional (Dik), and Dignity-based strengths.
Calculates Ishta and Kashta Phala for Vedic report analysis.
"""

from typing import Dict, Any, List
from .utils import get_planet_house, get_sign_of_planet
from shadbala.shadbala_engine import ShadbalaEngine
from shadbala.shadbala_normalizer import normalize_score
from shadbala.shadbala_ratio import calculate_ratio

EXALTED = {
    "Sun": "Aries",
    "Moon": "Taurus",
    "Mars": "Capricorn",
    "Mercury": "Virgo",
    "Jupiter": "Cancer",
    "Venus": "Pisces",
    "Saturn": "Libra",
    "Rahu": "Taurus",
    "Ketu": "Scorpio"
}

DEBILITATED = {
    "Sun": "Libra",
    "Moon": "Scorpio",
    "Mars": "Cancer",
    "Mercury": "Pisces",
    "Jupiter": "Capricorn",
    "Venus": "Virgo",
    "Saturn": "Aries",
    "Rahu": "Scorpio",
    "Ketu": "Taurus"
}

# Degrees for deep exaltation
DEEP_EXALT = {
    "Sun": 10,
    "Moon": 3,
    "Mars": 28,
    "Mercury": 15,
    "Jupiter": 5,
    "Venus": 27,
    "Saturn": 20,
}

MOOLATRIKONA = {
    "Sun": ("Leo", 0, 20),
    "Moon": ("Taurus", 4, 30),
    "Mars": ("Aries", 0, 12),
    "Mercury": ("Virgo", 16, 20),
    "Jupiter": ("Sagittarius", 0, 10),
    "Venus": ("Libra", 0, 15),
    "Saturn": ("Aquarius", 0, 20),
    "Rahu": ("Virgo", 0, 30),
    "Ketu": ("Pisces", 0, 30)
}

OWN_SIGNS = {
    "Sun": ["Leo"],
    "Moon": ["Cancer"],
    "Mars": ["Aries", "Scorpio"],
    "Mercury": ["Gemini", "Virgo"],
    "Jupiter": ["Sagittarius", "Pisces"],
    "Venus": ["Taurus", "Libra"],
    "Saturn": ["Capricorn", "Aquarius"],
    "Rahu": ["Virgo"],
    "Ketu": ["Pisces"]
}

SIGN_LORDS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

RELATIONS = {
    "Sun": {"friends": ["Moon", "Mars", "Jupiter"], "enemies": ["Venus", "Saturn"], "neutrals": ["Mercury"]},
    "Moon": {"friends": ["Sun", "Mercury"], "enemies": [], "neutrals": ["Mars", "Jupiter", "Venus", "Saturn"]},
    "Mars": {"friends": ["Sun", "Moon", "Jupiter"], "enemies": ["Mercury"], "neutrals": ["Venus", "Saturn"]},
    "Mercury": {"friends": ["Sun", "Venus"], "enemies": ["Moon"], "neutrals": ["Mars", "Jupiter", "Saturn"]},
    "Jupiter": {"friends": ["Sun", "Moon", "Mars"], "enemies": ["Mercury", "Venus"], "neutrals": ["Saturn"]},
    "Venus": {"friends": ["Mercury", "Saturn"], "enemies": ["Sun", "Moon"], "neutrals": ["Mars", "Jupiter"]},
    "Saturn": {"friends": ["Mercury", "Venus"], "enemies": ["Sun", "Moon", "Mars"], "neutrals": ["Jupiter"]},
    "Rahu": {"friends": ["Mercury", "Venus", "Saturn"], "enemies": ["Sun", "Moon", "Mars"], "neutrals": ["Jupiter"]},
    "Ketu": {"friends": ["Mars", "Venus", "Saturn"], "enemies": ["Sun", "Moon"], "neutrals": ["Mercury", "Jupiter"]},
}

# Dik Bala (Directional Strength) houses
DIK_BALA_HOUSES = {
    "Jupiter": 1,
    "Mercury": 1,
    "Moon": 4,
    "Venus": 4,
    "Saturn": 7,
    "Sun": 10,
    "Mars": 10,
}

PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]

def get_dignity(planet, sign, degree=None):
    """Determine the dignity of a planet based on its sign and degree."""
    if planet in ["Rahu", "Ketu"]:
        return "NEUTRAL"

    if sign == EXALTED.get(planet):
        return "EXALTED"
    
    if sign == DEBILITATED.get(planet):
        return "DEBILITATED"
    
    mt = MOOLATRIKONA.get(planet)
    if mt and sign == mt[0]:
        if degree is not None:
            if mt[1] <= (degree % 30) <= mt[2]:
                return "MOOLATRIKONA"
        else:
            return "MOOLATRIKONA"
            
    if sign in OWN_SIGNS.get(planet, []):
        return "OWN_SIGN"
            
    return "NEUTRAL"

def get_temporary_friends(chart: Dict[str, Any], planet: str) -> List[str]:
    """Identify temporary friends (planets in 2, 3, 4, 10, 11, 12 houses from planet)."""
    planet_house = get_planet_house(chart, planet)
    if planet_house is None: return []
    
    friends = []
    for p in PLANETS:
        if p == planet: continue
        p_house = get_planet_house(chart, p)
        if p_house is None: continue
        
        diff = (p_house - planet_house) % 12
        # Houses: 2nd(1), 3rd(2), 4th(3), 10th(9), 11th(10), 12th(11)
        if diff in [1, 2, 3, 9, 10, 11]:
             friends.append(p)
    return friends

def get_compound_dignity(chart: Dict[str, Any], planet: str, sign: str) -> str:
    """Determine dignity based on Panchadha Sambandha (Natural + Temporary)."""
    # 1) Core Dignities (Fixed)
    if sign == EXALTED.get(planet): return "EXALTED"
    if sign == DEBILITATED.get(planet): return "DEBILITATED"
    mt = MOOLATRIKONA.get(planet)
    if mt and sign == mt[0]: return "MOOLATRIKONA"
    if sign in OWN_SIGNS.get(planet, []): return "OWN_SIGN"
    
    # 2) Relationship based
    lord = SIGN_LORDS.get(sign)
    if not lord or planet not in RELATIONS: return "NEUTRAL"
    
    # Natural Relationship
    p_rel = RELATIONS[planet]
    natural_rel = "NEUTRAL"
    if lord in p_rel["friends"]: natural_rel = "FRIEND"
    elif lord in p_rel["enemies"]: natural_rel = "ENEMY"
    
    # Temporary Relationship
    temp_friends = get_temporary_friends(chart, planet)
    temp_rel = "FRIEND" if lord in temp_friends else "ENEMY"
    
    # Compound Logic
    if natural_rel == "FRIEND":
        return "GREAT_FRIEND" if temp_rel == "FRIEND" else "NEUTRAL"
    if natural_rel == "ENEMY":
        return "NEUTRAL" if temp_rel == "FRIEND" else "GREAT_ENEMY"
    
    # Natural is Neutral
    return "FRIEND" if temp_rel == "FRIEND" else "ENEMY"

def calculate_positional_strength(planet, sign, house):
    """Sthana Bala component based on sign and house type."""
    score = 60 # Base score (Sama)
    
    # Sign based
    if sign == EXALTED.get(planet):
        score = 90
    elif sign == DEBILITATED.get(planet):
        score = 20
    elif sign in OWN_SIGNS.get(planet, []):
        score = 80
        
    # House based (Kendra/Trikona)
    if house in [1, 4, 7, 10]:
        score += 15 # Kendra bonus
    elif house in [5, 9]:
        score += 10 # Trikona bonus
    elif house in [6, 8, 12]:
        score -= 10 # Dusthana penalty
        
    return score

def compute_ishta_kashta(planet, positional_score):
    """Simple calculation for Ishta and Kashta Phala."""
    # Scale: 0 to 60 (standard Virupas)
    # This is a highly simplified version
    ishta = positional_score * 0.6
    kashta = 60 - ishta
    return round(ishta, 2), round(kashta, 2)

def compute_detailed_strength(chart):
    """
    Main entry point for calculating quantitative strength values.
    Returns a dictionary of metrics for each planet.
    """
    results = {}
    engine = ShadbalaEngine()
    
    # Calculate using the new rich Shadbala engine
    engine_results = engine.compute(chart)
    
    for planet in PLANETS:
        house = get_planet_house(chart, planet)
        sign = get_sign_of_planet(chart, planet)
        
        if house is None or sign is None:
            results[planet] = {
                "total": 0.0,
                "total_score": 0.0,
                "dignity": "Unknown",
                "ishta_phala": 0.0,
                "kashta_phala": 0.0,
                "dik_bala": 0.0,
                "sthana": 0.0,
                "dig": 0.0,
                "kala": 0.0,
                "cheshta": 0.0,
                "naisargika": 0.0,
                "drik": 0.0,
                "house_contribution": 1
            }
            continue
            
        metrics = engine_results.get(planet, {})
        sthana = metrics.get("sthana", 0.0)
        dig = metrics.get("dig", 0.0)
        kala = metrics.get("kala", 0.0)
        cheshta = metrics.get("cheshta", 0.0)
        naisargika = metrics.get("naisargika", 0.0)
        drik = metrics.get("drik", 0.0)
        raw_total = metrics.get("total", 0.0)
        
        # Normalize raw total (in Virupas) to 0..10 Rupa range.
        # Uses the normalizer mapping (max_score=610 maps to 10 Rupas, reflecting new classical ranges)
        total_score = normalize_score(raw_total, max_score=610)
        
        # Calculate Classical BPHS Ratio
        ratio_data = calculate_ratio(planet, raw_total)
        
        # Ishta/Kashta Phala based on sthana (positional strength, 0-60 range)
        ishta, kashta = compute_ishta_kashta(planet, sthana)
        
        # Determine dignity (Natural + Temporary)
        dignity = get_compound_dignity(chart, planet, sign)
        if not dignity or dignity == "NEUTRAL":
            dignity = get_dignity(planet, sign)
            
        results[planet] = {
            "total": total_score,
            "total_score": total_score,
            "dignity": dignity,
            "ishta_phala": ishta,
            "kashta_phala": kashta,
            "dik_bala": dig,
            "sthana": sthana,
            "dig": dig,
            "kala": kala,
            "cheshta": cheshta,
            "naisargika": naisargika,
            "drik": drik,
            "ratio_data": ratio_data,
            "house_contribution": house
        }
        
    return results

def calculate_house_strength(chart, planet_strengths):
    """Calculate the strength of each house based on its lord and occupants."""
    house_scores = {}
    for h_num in range(1, 13):
        h_data = chart.get("houses", {}).get(h_num) or chart.get("houses", {}).get(str(h_num), {})
        
        # Base score from house type
        score = 50
        if h_num in [1, 4, 7, 10]: score = 70
        elif h_num in [5, 9]: score = 75
        elif h_num in [6, 8, 12]: score = 30
        
        # Add strength of planets residing in the house
        planets = h_data.get("planets", [])
        for p in planets:
            p_name = p.get("name") if isinstance(p, dict) else p
            p_strength = planet_strengths.get(p_name, {}).get("total_score", 50)
            score += (p_strength - 50) * 0.5
            
        house_scores[h_num] = round(max(0, score), 2)
        
    return house_scores

def run_strength_engine(chart):
    """
    Unified entry to compute all strength metrics.
    """
    planet_metrics = compute_detailed_strength(chart)
    house_metrics = calculate_house_strength(chart, planet_metrics)
    
    return {
        "planets": planet_metrics,
        "houses": house_metrics,
        "summary": "Detailed Shadbala analysis completed."
    }

# For backward compatibility with report_data.py
def compute_shadbala(chart):
    return run_strength_engine(chart)

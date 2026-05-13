# core/analysis/vimsopaka_pro_engine.py
"""
Vimsopaka Bala Assessment Engine - Professional Implementation.
Implements the 12-step methodology for planetary strength, interpretation, 
wealth, career, mental pattern, relationship, and remedies based on Vimsopaka Bala.
"""
from typing import Dict, Any, List, Optional
from core.analysis.vimsopaka_engine import compute_vimsopaka_bala
from core.analysis.utils import get_planet_house, get_sign_of_planet
from core.remedies.gemstone_rules import benefic_planets
from core.remedies.gemstone_database import GEMSTONE_MAP

PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]

SIGN_LORDS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

def classify_strength(score: float) -> str:
    """Professional Vimsopaka strength classification (5/10/15 model)."""
    if score < 5:
        return "Inauspicious"
    elif score < 10:
        return "Average"
    elif score < 15:
        return "Good"
    return "Excellent"

def _get_varga_avg_strength(vb_results: Dict[str, Any], category: str, planets: List[str]) -> float:
    """Calculates REAL average strength of key planets for a specific varga category."""
    scores = vb_results.get(category, {})
    valid_scores = [
        scores.get(p, 10.0)
        for p in planets
        if p in scores
    ]
    if not valid_scores:
        return 10.0
    return sum(valid_scores) / len(valid_scores)

def _get_house_support(chart: Dict[str, Any], house_num: int, primary_scores: Dict[str, float]) -> float:
    """Calculates house support based on lord strength and planetary occupants."""
    houses = (chart or {}).get("houses", {})
    h_data = houses.get(house_num) or houses.get(str(house_num)) or {}
    sign_name = h_data.get("sign_name")
    
    lord = SIGN_LORDS.get(sign_name) if isinstance(sign_name, str) else None
    lord_strength = primary_scores.get(lord, 10.0) if lord else 10.0
    
    planets_in_house = h_data.get("planets", [])
    planet_bonus = 0.0
    for p in planets_in_house:
        p_name = p.get("name") if isinstance(p, dict) else p
        if not isinstance(p_name, str): continue
            
        p_strength = primary_scores.get(p_name, 10.0)
        # Benefics give more bonus, Malefics slightly less unless strong
        weight = 0.6 if p_name in ["Jupiter", "Venus", "Moon", "Mercury"] else 0.4
        planet_bonus += (p_strength - 10.0) * weight
        
    return (lord_strength * 0.7) + (planet_bonus * 0.3)

def _is_afflicted(chart: Dict[str, Any], planet: str, malefics: List[str]) -> bool:
    """Checks for conjunction or close proximity with malefics in D1."""
    p_house = get_planet_house(chart, planet)
    if not p_house: return False
    
    for m in malefics:
        if m == planet: continue
        m_house = get_planet_house(chart, m)
        if m_house == p_house:
            return True
    return False

def _get_malefic_influence(chart: Dict[str, Any], house_num: int) -> float:
    """Calculates the burden of malefic planets in a specific house."""
    houses = (chart or {}).get("houses", {})
    h_data = houses.get(house_num) or houses.get(str(house_num)) or {}
    planets = h_data.get("planets", [])
    influence = 0.0
    MALEFICS = ["Mars", "Saturn", "Rahu", "Ketu"]
    for p in planets:
        p_name = p.get("name") if isinstance(p, dict) else p
        if isinstance(p_name, str) and p_name in MALEFICS:
            influence += 3.0
    return influence

def _get_remedy(planet: str, score: float) -> Dict[str, Any]:
    """Generates context-aware remedies based on planet and severity."""
    severity = "Severe" if score < 7 else "Moderate"
    remedies = {
        "Sun": {"planet": "Sun", "remedy": f"[{severity}] Offer water to Sun at sunrise, Donate Wheat", "benefit": "Authority & Health"},
        "Moon": {"planet": "Moon", "remedy": f"[{severity}] Meditation, Worship Goddess Parvati, Donate milk", "benefit": "Mental Peace"},
        "Mars": {"planet": "Mars", "remedy": f"[{severity}] Hanuman Chalisa, Fast on Tuesdays", "benefit": "Energy & Courage"},
        "Mercury": {"planet": "Mercury", "remedy": f"[{severity}] Feed cows green grass, Worship Lord Ganesha", "benefit": "Communication"},
        "Jupiter": {"planet": "Jupiter", "remedy": f"[{severity}] Worship Lord Vishnu, Respect Gurus", "benefit": "Wisdom & Wealth"},
        "Venus": {"planet": "Venus", "remedy": f"[{severity}] Worship Goddess Lakshmi, Help women in need", "benefit": "Relationships"},
        "Saturn": {"planet": "Saturn", "remedy": f"[{severity}] Worship Lord Shiva, Help laborers/underprivileged", "benefit": "Stability"},
        "Rahu": {"planet": "Rahu", "remedy": f"[{severity}] Donate blankets, Durga Chalisa", "benefit": "Protection"},
        "Ketu": {"planet": "Ketu", "remedy": f"[{severity}] Feed stray dogs, Ganesha Atharvashirsha", "benefit": "Spiritual Growth"}
    }
    return remedies.get(planet, {"planet": planet, "remedy": "General prayers", "benefit": "Balance"})

def run_vimsopaka_assessment(vargas: Dict[str, Any], chart: Dict[str, Any], dasha: Dict[str, Any]) -> Dict[str, Any]:
    """
    Unified entry to compute the full 12-step Vimsopaka Assessment.
    """
    vargas = vargas or {}
    chart = chart or {}
    dasha = dasha or {}
    
    # Step 1-5: Calculate Vimsopaka Bala
    vb_results = compute_vimsopaka_bala(vargas)
    
    # Step 6: Classification
    classification = {}
    for cat, scores in vb_results.items():
        classification[cat] = {p: classify_strength(score) for p, score in scores.items()}
        
    primary_cat = 'dasavarga' if 'dasavarga' in vb_results else 'shadvarga'
    primary_scores = vb_results.get(primary_cat) or vb_results.get('shadvarga') or {}
    primary_class = classification.get(primary_cat) or classification.get('shadvarga') or {}
    
    # Step 7: Professional Interpretation Engine
    interpretations = {}
    for p in PLANETS:
        score = primary_scores.get(p, 0.0)
        strength = primary_class.get(p, "Neutral")
        house = get_planet_house(chart, p)
        
        # Effect analysis
        if score > 15:
            effect = "Highly auspicious results and mastery in its domain."
        elif score > 12:
            effect = "Steady and supportive influence throughout life."
        elif score > 9:
            effect = "Moderate results; requires effort to manifest benefits."
        else:
            effect = "Potential struggles and delays; requires remedial measures."
            
        interpretations[p] = {
            "planet": p,
            "strength": strength,
            "house": house,
            "effect": effect,
            "vimsopaka_score": round(score, 2)
        }

    # Step 8: Wealth & Career Engine (with D10 priority)
    # Wealth = Jupiter + Venus + D2 + 11H Support
    jupiter_s = primary_scores.get("Jupiter", 10.0)
    venus_s = primary_scores.get("Venus", 10.0)
    d2_s = _get_varga_avg_strength(vb_results, "shadvarga", ["Jupiter", "Venus", "Mercury"])
    h11_s = _get_house_support(chart, 11, primary_scores)
    wealth_score = (jupiter_s * 0.3 + venus_s * 0.3 + d2_s * 0.2 + h11_s * 0.2)
    
    # Career = 10H + D10 Strength + Saturn + Mercury + Sun
    h10_s = _get_house_support(chart, 10, primary_scores)
    d10_s = _get_varga_avg_strength(vb_results, "dasavarga", ["Saturn", "Mercury", "Sun"])
    saturn_s = primary_scores.get("Saturn", 10.0)
    mercury_s = primary_scores.get("Mercury", 10.0)
    career_score = (h10_s * 0.2 + d10_s * 0.4 + saturn_s * 0.2 + mercury_s * 0.2)

    # Step 9: Mental Pattern Engine
    # Moon + Mercury - Afflictions
    moon_s = primary_scores.get("Moon", 10.0)
    mer_s = primary_scores.get("Mercury", 10.0)
    affliction_score = 0.0
    if _is_afflicted(chart, "Moon", ["Rahu", "Saturn", "Ketu"]):
        affliction_score = 4.0
    mental_score = (moon_s * 0.5 + mer_s * 0.5) - affliction_score
    
    # Step 10: Relationship Engine (with D9 priority)
    ven_s = primary_scores.get("Venus", 10.0)
    d9_s = _get_varga_avg_strength(vb_results, "shadvarga", ["Venus", "Jupiter", "Moon"])
    h7_s = _get_house_support(chart, 7, primary_scores)
    mal_inf = _get_malefic_influence(chart, 7)
    # D9 Multiplier for Destiny/Relationship
    rel_score = (ven_s * 0.3 + d9_s * 0.4 + h7_s * 0.3) - (mal_inf * 0.1)

    # Step 11: Remedies Engine
    remedies = []
    for p in PLANETS:
        if primary_scores.get(p, 20.0) < 11.0: # Professional threshold
            remedies.append(_get_remedy(p, primary_scores.get(p, 0.0)))

    # Step 12: Final Summary Engine
    # Consider Navamsa Strength (D9) for final ranking
    final_ranking_scores = {}
    for p in PLANETS:
        base = primary_scores.get(p, 10.0)
        d9_score = vb_results.get("shadvarga", {}).get(p, 10.0)
        final_ranking_scores[p] = (base * 0.7) + (d9_score * 0.3)
        
    strongest = sorted(final_ranking_scores.items(), key=lambda x: x[1], reverse=True)[:3]
    weakest = sorted(final_ranking_scores.items(), key=lambda x: x[1])[:2]
    
    # Step 12.1: Gemstone Selection (The "Ratna" Feature)
    lagna = chart.get("ascendant_sign") or "Aries"
    benefics = benefic_planets(lagna)
    top_gemstone = None
    
    # Priority: Benefic + Weak/Average Score (Strengthening needed)
    for p in benefics:
        score = final_ranking_scores.get(p, 10.0)
        if 7.0 <= score <= 14.0 and p in GEMSTONE_MAP:
            top_gemstone = {
                "planet": p,
                "stone": GEMSTONE_MAP[p],
                "reason": f"Most powerful benefic for {lagna} Lagna needing activation.",
                "score": round(score, 2)
            }
            break # Pick the first/highest priority benefic needing support

    summary = {
        "strongest_planets": [p[0] for p in strongest],
        "weakest_planets": [p[0] for p in weakest],
        "wealth_potential": classify_strength(wealth_score),
        "career_potential": classify_strength(career_score),
        "relationship_pattern": classify_strength(rel_score),
        "mental_stability": classify_strength(mental_score),
        "top_gemstone": top_gemstone
    }

    return {
        "vimsopaka_bala": vb_results,
        "classification": classification,
        "interpretations": interpretations,
        "wealth_career": {
            "wealth_score": round(wealth_score, 2),
            "career_score": round(career_score, 2),
            "wealth_status": classify_strength(wealth_score),
            "career_status": classify_strength(career_score)
        },
        "mental_pattern": {
            "score": round(mental_score, 2),
            "status": classify_strength(mental_score)
        },
        "relationship": {
            "score": round(rel_score, 2),
            "status": classify_strength(rel_score)
        },
        "remedies": remedies,
        "summary": summary
    }

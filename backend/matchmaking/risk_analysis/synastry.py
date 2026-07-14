# matchmaking/risk_analysis/synastry.py
from typing import Dict, Any

def _get_planet_longitude(planet: str, planet_positions: Dict[str, Any]) -> float:
    pos = planet_positions.get(planet)
    if not pos: return 0.0
    if "sidereal" in pos:
        return pos["sidereal"].get("lon", 0.0)
    elif "degree" in pos:
        deg = pos.get("degree", 0.0)
        sign_idx = pos.get("sign_index", 0)
        if deg > 30.0:
            return deg
        return sign_idx * 30.0 + deg
    elif "lon" in pos:
        return pos.get("lon", 0.0)
    return 0.0

def _get_aspect(lon1: float, lon2: float) -> str:
    diff = abs(lon1 - lon2)
    if diff > 180:
        diff = 360 - diff
        
    orb = 5.0
    if diff <= orb:
        return "Conjunction (0°)"
    elif 120 - orb <= diff <= 120 + orb:
        return "Trine (120°)"
    elif 90 - orb <= diff <= 90 + orb:
        return "Square (90°)"
    elif 180 - orb <= diff <= 180:
        return "Opposition (180°)"
    elif 60 - orb <= diff <= 60 + orb:
        return "Sextile (60°)"
        
    return "No Major Aspect"

def analyze_synastry(bride_chart: Dict[str, Any], groom_chart: Dict[str, Any]) -> Dict[str, Any]:
    b_pos = bride_chart.get("planet_positions", {})
    g_pos = groom_chart.get("planet_positions", {})
    
    b_venus = _get_planet_longitude("Venus", b_pos)
    b_mars = _get_planet_longitude("Mars", b_pos)
    
    g_venus = _get_planet_longitude("Venus", g_pos)
    g_mars = _get_planet_longitude("Mars", g_pos)
    
    # Groom Mars to Bride Venus
    gM_bV_aspect = _get_aspect(g_mars, b_venus)
    # Groom Venus to Bride Mars
    gV_bM_aspect = _get_aspect(g_venus, b_mars)
    
    score = 50
    desc = []
    
    # Helper to evaluate
    def evaluate_connection(aspect: str, pair_name: str):
        s = 0
        if aspect in ["Conjunction (0°)", "Trine (120°)"]:
            s += 25
            desc.append(f"The {pair_name} forms a {aspect}. This creates massive, magnetic physical attraction and a deep romantic bond that keeps the marriage alive through hard times.")
        elif aspect == "Sextile (60°)":
            s += 15
            desc.append(f"The {pair_name} forms a {aspect}, bringing friendly and supportive romantic chemistry.")
        elif aspect == "Square (90°)":
            s -= 20
            desc.append(f"The {pair_name} forms a {aspect}, which can cause immense friction, impulsiveness, and intense but volatile passion.")
        elif aspect == "Opposition (180°)":
            s += 10
            desc.append(f"The {pair_name} forms an {aspect}, creating a powerful 'opposites attract' dynamic that is highly stimulating but requires balance.")
        return s
        
    s1 = evaluate_connection(gM_bV_aspect, "Groom's Mars and Bride's Venus")
    s2 = evaluate_connection(gV_bM_aspect, "Groom's Venus and Bride's Mars")
    
    score += s1 + s2
    
    if s1 == 0 and s2 == 0:
        desc.append("No exact degree-based major aspects found between Venus and Mars. Attraction will be based on overall chart compatibility rather than this specific magnetic synastry.")
        
    score = max(0, min(100, score))
    
    status = "Neutral"
    if score >= 80:
        status = "Highly Magnetic"
    elif score >= 60:
        status = "Strong Chemistry"
    elif score < 40:
        status = "Friction/Volatile"
        
    return {
        "score": score,
        "status": status,
        "description": " ".join(desc),
        "aspects": {
            "groom_mars_bride_venus": gM_bV_aspect,
            "groom_venus_bride_mars": gV_bM_aspect
        }
    }

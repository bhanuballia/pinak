# matchmaking/risk_analysis/progeny_sphuta.py
from typing import Dict, Any

def _get_planet_longitude(planet: str, planet_positions: Dict[str, Any]) -> float:
    pos = planet_positions.get(planet)
    if not pos: return 0.0
    if "sidereal" in pos:
        return pos["sidereal"].get("lon", 0.0)
    elif "degree" in pos:
        # Check if degree is absolute (0-360) or relative (0-30). If relative, we need sign_index.
        deg = pos.get("degree", 0.0)
        sign_idx = pos.get("sign_index", 0)
        if deg > 30.0:
            return deg
        return sign_idx * 30.0 + deg
    elif "lon" in pos:
        return pos.get("lon", 0.0)
    return 0.0

def _get_sign_and_navamsha(longitude: float) -> tuple:
    # 0 = Aries, 1 = Taurus, ...
    sign_idx = int(longitude / 30)
    
    # Navamsha is 3 degrees 20 minutes (3.3333 degrees)
    navamsha_idx = int((longitude % 30) / (30/9))
    
    # Absolute Navamsha sign
    element = sign_idx % 4
    if element == 0: # Fire
        start_nav_sign = 0
    elif element == 1: # Earth
        start_nav_sign = 9
    elif element == 2: # Air
        start_nav_sign = 6
    else: # Water
        start_nav_sign = 3
        
    nav_sign_idx = (start_nav_sign + navamsha_idx) % 12
    
    return sign_idx, nav_sign_idx

def analyze_progeny_sphuta(bride_chart: Dict[str, Any], groom_chart: Dict[str, Any]) -> Dict[str, Any]:
    b_pos = bride_chart.get("planet_positions", {})
    g_pos = groom_chart.get("planet_positions", {})
    
    # Beeja Sphuta (Groom): Sun + Venus + Jupiter
    g_sun = _get_planet_longitude("Sun", g_pos)
    g_ven = _get_planet_longitude("Venus", g_pos)
    g_jup = _get_planet_longitude("Jupiter", g_pos)
    
    beeja_lon = (g_sun + g_ven + g_jup) % 360
    b_sign_idx, b_nav_idx = _get_sign_and_navamsha(beeja_lon)
    
    # Kshetra Sphuta (Bride): Moon + Mars + Jupiter
    b_moon = _get_planet_longitude("Moon", b_pos)
    b_mars = _get_planet_longitude("Mars", b_pos)
    b_jup = _get_planet_longitude("Jupiter", b_pos)
    
    kshetra_lon = (b_moon + b_mars + b_jup) % 360
    k_sign_idx, k_nav_idx = _get_sign_and_navamsha(kshetra_lon)
    
    # Evaluation
    # Beeja (Groom) is strong if odd sign and odd navamsha
    beeja_odd_sign = (b_sign_idx % 2 == 0) # Aries(0) is odd
    beeja_odd_nav = (b_nav_idx % 2 == 0)
    
    beeja_strength = 0
    if beeja_odd_sign and beeja_odd_nav: beeja_strength = 2
    elif beeja_odd_sign or beeja_odd_nav: beeja_strength = 1
    
    # Kshetra (Bride) is strong if even sign and even navamsha
    kshetra_even_sign = (k_sign_idx % 2 == 1) # Taurus(1) is even
    kshetra_even_nav = (k_nav_idx % 2 == 1)
    
    kshetra_strength = 0
    if kshetra_even_sign and kshetra_even_nav: kshetra_strength = 2
    elif kshetra_even_sign or kshetra_even_nav: kshetra_strength = 1
    
    status = ""
    score = 0
    
    if beeja_strength == 2 and kshetra_strength == 2:
        status = "Excellent (Highly Fertile)"
        score = 100
        desc = "Both Beeja Sphuta (Groom) and Kshetra Sphuta (Bride) fall in optimal signs and navamshas. This indicates excellent prospects for healthy progeny without delays."
    elif beeja_strength >= 1 and kshetra_strength >= 1:
        status = "Good (Normal)"
        score = 80
        desc = "Good prospects for progeny. The Sphutas are adequately placed, though minor astrological remedies might be suggested for timely childbirth."
    elif beeja_strength == 0 and kshetra_strength == 0:
        status = "Challenging (Delays Possible)"
        score = 30
        desc = "Both Beeja and Kshetra Sphuta are weak (falling in barren/non-optimal signs). This indicates potential astrological delays or the need for medical assistance regarding childbirth."
    else:
        status = "Moderate (Effort Required)"
        score = 60
        desc = "One of the partners has a weak Sphuta. Astrological remedies and medical planning are recommended to ensure smooth progeny."
        
    return {
        "status": status,
        "score": score,
        "description": desc,
        "groom_beeja_strength": beeja_strength,
        "bride_kshetra_strength": kshetra_strength
    }

# matchmaking/risk_analysis/darakaraka.py
from typing import Dict, Any

FRIENDS = {
    "Sun": ["Moon", "Mars", "Jupiter"],
    "Moon": ["Sun", "Mercury"],
    "Mars": ["Sun", "Moon", "Jupiter"],
    "Mercury": ["Sun", "Venus"],
    "Jupiter": ["Sun", "Moon", "Mars"],
    "Venus": ["Mercury", "Saturn"],
    "Saturn": ["Mercury", "Venus"]
}

def _get_planet_sign_index(planet: str, chart: Dict[str, Any]) -> int:
    for h_num, h_data in chart.get("houses", {}).items():
        if not isinstance(h_data, dict): continue
        for p in h_data.get("planets", []):
            p_name = p.get("name") if isinstance(p, dict) else p
            if p_name == planet:
                # Need to return a 0-11 index. If sign_index is 1-12, adjust it.
                idx = h_data.get("sign_index", 0)
                # Some parts of the codebase use 0-11, others 1-12. Let's just use it as is for relative distance.
                return idx
    return 0

def analyze_darakaraka_compatibility(bride_chart: Dict[str, Any], groom_chart: Dict[str, Any]) -> Dict[str, Any]:
    from matchmaking.jaimini.jaimini_engine import JaiminiEngine
    engine = JaiminiEngine()
    
    b_dk = engine._calculate_dara_karaka(bride_chart.get("planet_positions", {}))
    g_dk = engine._calculate_dara_karaka(groom_chart.get("planet_positions", {}))
    
    b_dk_sign = _get_planet_sign_index(b_dk, bride_chart)
    g_dk_sign = _get_planet_sign_index(g_dk, groom_chart)
    
    score = 50
    desc = []
    
    # Check Friendship
    if b_dk == g_dk:
        score += 30
        desc.append(f"Both partners share the exact same Darakaraka ({b_dk}), indicating an identical approach to soul-level love.")
    elif b_dk in FRIENDS and g_dk in FRIENDS.get(b_dk, []) and g_dk in FRIENDS and b_dk in FRIENDS.get(g_dk, []):
        score += 25
        desc.append(f"The Bride's Darakaraka ({b_dk}) and Groom's Darakaraka ({g_dk}) are mutual friends. This brings natural harmony and an unbreakable soulmate connection.")
    else:
        desc.append(f"The Darakarakas ({b_dk} and {g_dk}) have a neutral or challenging natural relationship.")
        
    # Check House Relationship (Axis)
    dist = (g_dk_sign - b_dk_sign) % 12 + 1
    dist_rev = (b_dk_sign - g_dk_sign) % 12 + 1
    rel = f"{dist}/{dist_rev}"
    
    if rel in ["1/1", "7/7"]:
        score += 25
        desc.append(f"They sit on a {rel} axis, mirroring each other perfectly.")
    elif rel in ["5/9", "9/5", "3/11", "11/3"]:
        score += 25
        desc.append(f"They sit on a harmonious {rel} axis, ensuring smooth energetic flow.")
    elif rel in ["2/12", "12/2", "6/8", "8/6"]:
        score -= 20
        desc.append(f"They sit on a challenging {rel} axis, meaning karmic adjustments are required.")
        
    score = max(0, min(100, score))
    
    status = "Moderate"
    if score >= 80:
        status = "Soulmate Connection (Excellent)"
    elif score >= 60:
        status = "Harmonious"
    elif score < 40:
        status = "Karmic Challenge"
        
    return {
        "score": score,
        "status": status,
        "description": " ".join(desc),
        "bride_dk": b_dk,
        "groom_dk": g_dk
    }

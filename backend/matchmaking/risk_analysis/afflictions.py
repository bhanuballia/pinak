# matchmaking/risk_analysis/afflictions.py
from typing import List, Dict, Any

def analyze_planetary_afflictions(bride_chart: Dict[str, Any], groom_chart: Dict[str, Any]) -> List[Dict[str, str]]:
    """
    Detailed diagnostic of planetary afflictions between partners.
    """
    afflictions = []
    
    def get_planet_houses(chart):
        pos = {}
        for h_num, h_data in chart.get("houses", {}).items():
            for p_entry in h_data.get("planets", []):
                p_name = p_entry["name"] if isinstance(p_entry, dict) else p_entry
                pos[p_name] = int(h_num)
        return pos

    b_pos = get_planet_houses(bride_chart)
    g_pos = get_planet_houses(groom_chart)
    
    # 1. Mars-Saturn (Conflict/Ego)
    if b_pos.get("Mars") == g_pos.get("Saturn") or g_pos.get("Mars") == b_pos.get("Saturn"):
        afflictions.append({
            "title": "Mars-Saturn Conflict",
            "impact": "High",
            "description": "Cross-chart conjunction of Mars and Saturn indicates potential for power struggles and ego friction."
        })
        
    # 2. Rahu-Mars (Angarak/Volatility)
    if b_pos.get("Mars") == g_pos.get("Rahu") or g_pos.get("Mars") == b_pos.get("Rahu"):
        afflictions.append({
            "title": "Angarak Affliction",
            "impact": "Severe",
            "description": "Mars-Rahu intersection creates explosive intensity and sudden emotional volatility in the relationship."
        })
        
    # 3. Sun-Saturn (Authority issues)
    if b_pos.get("Sun") == g_pos.get("Saturn") or g_pos.get("Sun") == b_pos.get("Saturn"):
        afflictions.append({
            "title": "Solar-Saturn Dissonance",
            "impact": "Medium",
            "description": "Dissonance between Sun and Saturn suggests challenges with mutual respect and authority boundaries."
        })

    # 4. 7th House Affliction (Simplified check)
    # (Assuming Rahu/Ketu/Saturn in each other's 7th house)
    malefics = ["Saturn", "Rahu", "Ketu", "Mars"]
    for m in malefics:
        if b_pos.get(m) == 7:
            afflictions.append({
                "title": f"Bride 7th House {m}",
                "impact": "Medium",
                "description": f"Presence of {m} in the bride's 7th house requires careful remedial measures for harmony."
            })
        if g_pos.get(m) == 7:
            afflictions.append({
                "title": f"Groom 7th House {m}",
                "impact": "Medium",
                "description": f"Presence of {m} in the groom's 7th house suggests potential challenges in marital bonding."
            })

    return afflictions

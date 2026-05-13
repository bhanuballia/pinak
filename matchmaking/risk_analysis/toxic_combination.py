# matchmaking/risk_analysis/toxic_combination.py
from typing import List, Dict, Any

def detect_toxic_combinations(bride_chart: Dict[str, Any], groom_chart: Dict[str, Any]) -> List[str]:
    """
    Detects explosive planetary combinations between partners.
    Example: One partner's Mars over other's Rahu/Saturn.
    """
    warnings = []
    
    def get_planet_houses(chart):
        pos = {}
        for h_num, h_data in chart.get("houses", {}).items():
            for p_entry in h_data.get("planets", []):
                p_name = p_entry["name"] if isinstance(p_entry, dict) else p_entry
                pos[p_name] = int(h_num)
        return pos

    # Get positions
    b_pos = get_planet_houses(bride_chart)
    g_pos = get_planet_houses(groom_chart)
    
    # Mars-Saturn Conflict
    if b_pos.get("Mars") == g_pos.get("Saturn") or g_pos.get("Mars") == b_pos.get("Saturn"):
        warnings.append("Mars-Saturn conjunction across charts: Potential for ego friction.")
        
    # Rahu-Mars Intensity
    if b_pos.get("Mars") == g_pos.get("Rahu") or g_pos.get("Mars") == b_pos.get("Rahu"):
        warnings.append("Mars-Rahu intersection: High intensity/Volatility detected.")

    return warnings

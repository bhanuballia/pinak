# matchmaking/risk_analysis/trishamsha.py
from typing import Dict, Any

MALEFICS = {"Sun", "Mars", "Saturn", "Rahu", "Ketu"}
BENEFICS = {"Jupiter", "Venus", "Mercury", "Moon"}

def _get_house_planets(house_num: str, chart: Dict[str, Any]) -> list:
    h_data = chart.get("houses", {}).get(house_num)
    if isinstance(h_data, dict):
        planets = h_data.get("planets", [])
        return [p.get("name") if isinstance(p, dict) else p for p in planets]
    return []

def analyze_d30_trishamsha(bride_d30: Dict[str, Any], groom_d30: Dict[str, Any]) -> Dict[str, Any]:
    score = 100
    desc = []
    
    if not bride_d30 or not groom_d30:
        return {
            "score": 50,
            "status": "Unknown",
            "description": "D-30 charts not available for analysis.",
            "bride_penalty": 0,
            "groom_penalty": 0
        }
        
    def evaluate_person(d30_chart: Dict[str, Any], title: str) -> int:
        h1_planets = _get_house_planets("1", d30_chart)
        h7_planets = _get_house_planets("7", d30_chart)
        
        malefic_count = 0
        for p in h1_planets + h7_planets:
            if p in MALEFICS:
                malefic_count += 1
                
        if malefic_count >= 2:
            desc.append(f"Severe Warning for {title}: The D-30 (Trishamsha) Ascendant/7th axis is heavily afflicted by {malefic_count} malefics ({', '.join([p for p in h1_planets+h7_planets if p in MALEFICS])}). This indicates potential hidden vices, suppressed psychological trauma, severe anger issues, or deep past-life karmic shadows that will surface later in the marriage.")
            return 30
        elif malefic_count == 1:
            desc.append(f"Moderate Warning for {title}: The D-30 chart has one malefic on the 1/7 axis, suggesting some minor hidden psychological baggage or occasional ethical compromises.")
            return 10
        else:
            benefic_count = sum(1 for p in h1_planets + h7_planets if p in BENEFICS)
            if benefic_count > 0:
                desc.append(f"Excellent for {title}: The D-30 chart is clean and influenced by benefics, indicating high ethics, pure intentions, and strong moral character.")
            else:
                desc.append(f"Neutral for {title}: The D-30 Ascendant/7th axis is empty, indicating a normal psychological and ethical baseline.")
            return 0
            
    b_penalty = evaluate_person(bride_d30, "Bride")
    g_penalty = evaluate_person(groom_d30, "Groom")
    
    score -= (b_penalty + g_penalty)
    score = max(0, min(100, score))
    
    status = "Ethically Sound"
    if score >= 90:
        status = "Highly Ethical & Pure"
    elif score >= 70:
        status = "Average"
    elif score < 70:
        status = "Psychological Red Flag"
        
    return {
        "score": score,
        "status": status,
        "description": " ".join(desc),
        "bride_penalty": b_penalty,
        "groom_penalty": g_penalty
    }

# matchmaking/risk_analysis/karaka_analysis.py
from typing import Dict, Any, List

MALEFICS = ["Saturn", "Rahu", "Ketu", "Mars", "Sun"]
EXALTED = {"Venus": "Pisces", "Jupiter": "Cancer"}
DEBILITATED = {"Venus": "Virgo", "Jupiter": "Capricorn"}
OWN_SIGNS = {"Venus": ["Taurus", "Libra"], "Jupiter": ["Sagittarius", "Pisces"]}

def _get_planet_info(chart: Dict[str, Any], target_planet: str) -> Dict[str, Any]:
    for h_num, h_data in chart.get("houses", {}).items():
        if not isinstance(h_data, dict): continue
        for p in h_data.get("planets", []):
            p_name = p.get("name") if isinstance(p, dict) else p
            if p_name == target_planet:
                return {
                    "house": int(h_num),
                    "sign": h_data.get("sign_name", h_data.get("sign", "")),
                    "co_occupants": [
                        op.get("name") if isinstance(op, dict) else op 
                        for op in h_data.get("planets", []) 
                        if (op.get("name") if isinstance(op, dict) else op) != target_planet
                    ]
                }
    return {}

def analyze_marriage_karakas(bride_chart: Dict[str, Any], groom_chart: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyzes the primary marriage Karakas (significators):
    - Jupiter for the Bride
    - Venus for the Groom
    """
    if not bride_chart or not groom_chart:
        return {}

    bride_jupiter = _get_planet_info(bride_chart, "Jupiter")
    groom_venus = _get_planet_info(groom_chart, "Venus")
    
    def evaluate_karaka(planet: str, info: Dict[str, Any]) -> Dict[str, Any]:
        if not info:
            return {"status": "Unknown", "score": 50, "issues": []}
            
        sign = info["sign"]
        co_occupants = info["co_occupants"]
        
        score = 100
        status = "Good"
        issues = []
        
        if sign == EXALTED.get(planet):
            score += 20
            status = "Exalted (Excellent)"
        elif sign == DEBILITATED.get(planet):
            score -= 30
            status = "Debilitated (Weak)"
            issues.append(f"{planet} is debilitated in {sign}.")
        elif sign in OWN_SIGNS.get(planet, []):
            score += 15
            status = "Own Sign (Strong)"
            
        # Check afflictions by conjunction
        malefic_conjunctions = [p for p in co_occupants if p in MALEFICS]
        if malefic_conjunctions:
            score -= (15 * len(malefic_conjunctions))
            issues.append(f"{planet} is conjunct malefics: {', '.join(malefic_conjunctions)}.")
            if score < 50 and status != "Debilitated (Weak)":
                status = "Highly Afflicted"
        
        score = max(0, min(100, score))
        return {
            "house": info["house"],
            "sign": sign,
            "status": status,
            "score": score,
            "issues": issues,
            "is_afflicted": score < 60
        }

    bride_analysis = evaluate_karaka("Jupiter", bride_jupiter)
    groom_analysis = evaluate_karaka("Venus", groom_venus)
    
    avg_score = (bride_analysis["score"] + groom_analysis["score"]) / 2
    overall_status = "Excellent"
    if avg_score < 40:
        overall_status = "Highly Afflicted (Remedies Required)"
    elif avg_score < 60:
        overall_status = "Moderate (Some challenges in marital bliss)"
    elif avg_score < 80:
        overall_status = "Good"
        
    return {
        "overall_score": avg_score,
        "overall_status": overall_status,
        "bride": {
            "karaka": "Jupiter",
            "analysis": bride_analysis
        },
        "groom": {
            "karaka": "Venus",
            "analysis": groom_analysis
        }
    }

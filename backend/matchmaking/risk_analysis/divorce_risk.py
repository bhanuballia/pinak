# matchmaking/risk_analysis/divorce_risk.py
from typing import Dict, Any

def calculate_divorce_risk(bride_chart: Dict[str, Any], groom_chart: Dict[str, Any], success_prob: float) -> Dict[str, Any]:
    """
    Analyzes the risk of divorce based on chart afflictions and low compatibility.
    """
    risk_score = 0
    reasons = []
    
    if success_prob < 40:
        risk_score += 40
        reasons.append("Low overall compatibility (< 40%)")

    def check_7th_house(chart, person):
        nonlocal risk_score, reasons
        houses = chart.get("houses", {})
        if not houses:
            return
            
        h7_data = houses.get(7) or houses.get("7", {})
        h7 = h7_data.get("planets", [])
        h7_planets = [p["name"] if isinstance(p, dict) else p for p in h7]
        
        malefics = []
        if "Mars" in h7_planets: malefics.append("Mars")
        if "Saturn" in h7_planets: malefics.append("Saturn")
        if "Rahu" in h7_planets: malefics.append("Rahu")
        if "Ketu" in h7_planets: malefics.append("Ketu")
        if "Sun" in h7_planets: malefics.append("Sun")
        
        if malefics:
            risk_score += len(malefics) * 15
            reasons.append(f"{person} has malefic influence ({', '.join(malefics)}) in the 7th House.")
            
        if "Jupiter" in h7_planets or "Venus" in h7_planets:
            risk_score -= 10
            if risk_score < 0: risk_score = 0
            reasons.append(f"{person} has benefic mitigation in the 7th House.")

    check_7th_house(bride_chart, "Bride")
    check_7th_house(groom_chart, "Groom")
    
    risk_score = min(100, max(0, risk_score))
    
    risk_level = "Low"
    if risk_score >= 60: risk_level = "High"
    elif risk_score >= 30: risk_level = "Medium"
    
    if not reasons:
        reasons.append("Chart stability is within acceptable Vedic thresholds.")
    
    return {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "reasons": reasons
    }

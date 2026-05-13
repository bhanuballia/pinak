# matchmaking/risk_analysis/divorce_risk.py
from typing import Dict, Any

def calculate_divorce_risk(bride_vargas: Dict[str, Any], groom_vargas: Dict[str, Any], success_prob: float) -> Dict[str, Any]:
    """
    Analyzes the risk of divorce based on chart afflictions and low compatibility.
    """
    risk_score = 0
    reasons = []
    
    if success_prob < 40:
        risk_score += 40
        reasons.append("Low overall compatibility (< 40%)")
    
    # Check 7th house in Navamsa for both
    # (Simplified logic: looking for malefic influence if we had detailed aspect engine)
    
    # Logic for Rahu/Mars/Saturn in 7th/8th of Navamsa
    
    risk_level = "Low"
    if risk_score > 60: risk_level = "High"
    elif risk_score > 30: risk_level = "Medium"
    
    return {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "reasons": reasons
    }

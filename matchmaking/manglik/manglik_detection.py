# matchmaking/manglik/manglik_detection.py
"""
Manglik Dosha Detection and Cancellation Engine.
Analyzes Mars placement and provides cancellation rules for matchmaking.
"""

from typing import Dict, Any, List

def check_manglik_dosha(chart: Dict[str, Any]) -> Dict[str, Any]:
    """
    Checks if a chart has Manglik Dosha.
    Mars in 1, 2, 4, 7, 8, 12 houses.
    """
    houses = chart.get("houses", {})
    mars_house = 0
    for h_num, h_data in houses.items():
        planets = h_data.get("planets", [])
        for p in planets:
            p_name = p.get("name") if isinstance(p, dict) else p
            if p_name == "Mars":
                mars_house = int(h_num)
                break
        if mars_house: break
        
    is_manglik = mars_house in [1, 2, 4, 7, 8, 12]
    
    # Severity based on house
    severity = 0
    if is_manglik:
        if mars_house in [7, 8]: severity = 100 # High
        elif mars_house in [1, 4, 12]: severity = 70 # Medium
        else: severity = 40 # Low (2nd house)
        
    return {
        "is_manglik": is_manglik,
        "mars_house": mars_house,
        "severity": severity,
        "type": "Anshik" if severity < 70 else "Purna"
    }

def analyze_manglik_compatibility(bride_manglik: Dict[str, Any], groom_manglik: Dict[str, Any]) -> Dict[str, Any]:
    """
    Compares two Manglik reports and checks for cancellation.
    """
    b_is = bride_manglik["is_manglik"]
    g_is = groom_manglik["is_manglik"]
    
    cancelled = False
    reason = ""
    
    if b_is and g_is:
        cancelled = True
        reason = "Both are Manglik (Dosha Samyam)"
    elif not b_is and not g_is:
        cancelled = True
        reason = "Neither is Manglik"
    else:
        # One is Manglik, one is not
        cancelled = False
        reason = "One-sided Manglik Dosha. Requires careful consideration or strong remedies."
        
    return {
        "cancelled": cancelled,
        "reason": reason,
        "status": "Safe" if cancelled else "Requires Remedy"
    }

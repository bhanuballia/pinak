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
    mars_sign = ""
    for h_num, h_data in houses.items():
        planets = h_data.get("planets", [])
        for p in planets:
            p_name = p.get("name") if isinstance(p, dict) else p
            if p_name == "Mars":
                mars_house = int(h_num)
                mars_sign = h_data.get("sign", "")
                break
        if mars_house: break
        
    is_manglik = mars_house in [1, 2, 4, 7, 8, 12]
    
    # Internal Cancellation Check (Parihara)
    internal_cancellation = False
    cancellation_reason = ""
    
    if is_manglik:
        # Check if Mars is in its own sign (Aries, Scorpio) or exalted (Capricorn)
        if mars_sign in ["Aries", "Scorpio"]:
            internal_cancellation = True
            cancellation_reason = f"Mars is in its own sign ({mars_sign}), neutralizing the dosha."
        elif mars_sign == "Capricorn":
            internal_cancellation = True
            cancellation_reason = "Mars is exalted in Capricorn, neutralizing the dosha."
            
    # Severity based on house
    severity = 0
    if is_manglik and not internal_cancellation:
        if mars_house in [7, 8]: severity = 100 # High
        elif mars_house in [1, 4, 12]: severity = 70 # Medium
        else: severity = 40 # Low (2nd house)
        
    return {
        "is_manglik": is_manglik and not internal_cancellation,
        "mars_house": mars_house,
        "mars_sign": mars_sign,
        "severity": severity,
        "type": "Anshik" if severity < 70 else "Purna",
        "internal_cancellation": internal_cancellation,
        "cancellation_reason": cancellation_reason,
        "original_is_manglik": is_manglik,
        "malefics_in_dosha_houses": _get_malefics_in_dosha_houses(chart)
    }

def _get_malefics_in_dosha_houses(chart: Dict[str, Any]) -> List[int]:
    houses = chart.get("houses", {})
    malefics_houses = []
    dosha_houses = [1, 2, 4, 7, 8, 12]
    for h_num in dosha_houses:
        h_data = houses.get(str(h_num), {})
        if not isinstance(h_data, dict):
            continue
        planets = h_data.get("planets", [])
        for p in planets:
            p_name = p.get("name") if isinstance(p, dict) else p
            # Saturn, Rahu, Ketu, and Sun act as balancing malefics
            if p_name in ["Saturn", "Rahu", "Ketu", "Sun"]:
                malefics_houses.append(int(h_num))
                break
    return malefics_houses

def analyze_manglik_compatibility(bride_manglik: Dict[str, Any], groom_manglik: Dict[str, Any]) -> Dict[str, Any]:
    """
    Compares two Manglik reports and checks for cancellation.
    """
    b_is = bride_manglik.get("is_manglik", False)
    g_is = groom_manglik.get("is_manglik", False)
    
    b_internal = bride_manglik.get("internal_cancellation", False)
    g_internal = groom_manglik.get("internal_cancellation", False)
    
    cancelled = False
    reason = ""
    
    if b_is and g_is:
        cancelled = True
        reason = "Both are Manglik (Dosha Samyam)"
    elif not b_is and not g_is:
        cancelled = True
        reason = "Neither is Manglik"
        
        # Add context if internal cancellations happened
        if b_internal and g_internal:
            reason += " (Both had dosha neutralized by Mars placement)"
        elif b_internal:
            reason += " (Bride's dosha neutralized by Mars placement)"
        elif g_internal:
            reason += " (Groom's dosha neutralized by Mars placement)"
            
    else:
        # One is Manglik, one is not
        manglik_person = bride_manglik if b_is else groom_manglik
        non_manglik_person = groom_manglik if b_is else bride_manglik
        person_name = "Bride" if b_is else "Groom"
        other_name = "Groom" if b_is else "Bride"
        
        m_house = manglik_person.get("mars_house")
        other_malefics = non_manglik_person.get("malefics_in_dosha_houses", [])
        
        # Check if the non-Manglik person has a balancing malefic in the exact same house
        if m_house in other_malefics:
            cancelled = True
            reason = f"One-sided Manglik Dosha cancelled: {other_name} has a balancing malefic in house {m_house}."
        # Or if they have balancing malefics in any of the dosha houses
        elif other_malefics:
            cancelled = True
            reason = f"One-sided Manglik Dosha balanced: {other_name} has balancing malefics in dosha houses ({', '.join(map(str, other_malefics))})."
        else:
            cancelled = False
            reason = f"One-sided Manglik Dosha ({person_name}). Requires careful consideration or strong remedies."
        
    return {
        "cancelled": cancelled,
        "reason": reason,
        "status": "Safe" if cancelled else "Requires Remedy"
    }

# dasha/sudasha.py
"""
Jaimini Sudasha basic scaffold.
Sudasha is a sign-based dasha often used for assessing prosperity and wealth.
"""
from __future__ import annotations
from typing import List, Dict, Any

ZODIAC_ORDER = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

def compute_sudasha(start_sign: str = "Aries", years_ahead: float = 120.0) -> List[Dict[str, Any]]:
    """
    Produce a basic Sudasha sequence.
    This is a simplified scaffold assigning a fixed placeholder duration 
    per sign.
    """
    seq = []
    cur = 0.0
    try:
        start_index = ZODIAC_ORDER.index(start_sign)
    except ValueError:
        start_index = 0
        
    i = start_index
    while cur < years_ahead:
        sign = ZODIAC_ORDER[i % len(ZODIAC_ORDER)]
        
        # Placeholder duration of 10 years
        dur = 10.0 
        
        if cur + dur > years_ahead:
            dur = years_ahead - cur
            
        seq.append({"item": sign, "start": cur, "end": cur + dur, "duration": dur})
        cur += dur
        i += 1
        
    return seq

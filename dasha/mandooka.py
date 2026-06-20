# dasha/mandooka.py
"""
Jaimini Mandooka Dasha basic scaffold.
Mandooka (frog) Dasha is a sign-based dasha where periods jump 
to every third sign (like a frog's leap).
"""
from __future__ import annotations
from typing import List, Dict, Any

MANDOOKA_ORDER = [
    "Aries", "Cancer", "Libra", "Capricorn",
    "Taurus", "Leo", "Scorpio", "Aquarius",
    "Gemini", "Virgo", "Sagittarius", "Pisces"
]

def compute_mandooka(start_sign: str = "Aries", years_ahead: float = 120.0) -> List[Dict[str, Any]]:
    """
    Produce a basic Mandooka Dasha sequence.
    This is a simplified scaffold assigning a fixed placeholder duration 
    per sign.
    """
    seq = []
    cur = 0.0
    try:
        start_index = MANDOOKA_ORDER.index(start_sign)
    except ValueError:
        start_index = 0
        
    i = start_index
    while cur < years_ahead:
        sign = MANDOOKA_ORDER[i % len(MANDOOKA_ORDER)]
        
        # Placeholder duration of 10 years
        dur = 10.0 
        
        if cur + dur > years_ahead:
            dur = years_ahead - cur
            
        seq.append({"item": sign, "start": cur, "end": cur + dur, "duration": dur})
        cur += dur
        i += 1
        
    return seq

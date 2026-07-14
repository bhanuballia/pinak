# dasha/chara.py
"""
Jaimini Chara Dasha basic scaffold.

Chara Dasha is a sign-based dasha system where the periods run through 
zodiac signs rather than planets. The duration of each sign's run 
depends on the distance from the sign to its lord.

This file provides a lightweight placeholder returning a simplified sequence.
"""
from __future__ import annotations
from typing import List, Dict, Any

CHARA_ORDER_DIRECT = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

def compute_chara(start_sign: str = "Aries", years_ahead: float = 120.0) -> List[Dict[str, Any]]:
    """
    Produce a basic Chara Dasha sequence.
    This is a simplified scaffold that assigns a fixed placeholder duration
    per sign for demonstration purposes.
    """
    seq = []
    cur = 0.0
    try:
        start_index = CHARA_ORDER_DIRECT.index(start_sign)
    except ValueError:
        start_index = 0
        
    i = start_index
    while cur < years_ahead:
        sign = CHARA_ORDER_DIRECT[i % len(CHARA_ORDER_DIRECT)]
        
        # In a fully realized Chara Dasha logic, 'dur' would depend on 
        # counting from the sign to its lord. We use 10 for scaffolding.
        dur = 10.0 
        
        # Cap the final period if it exceeds the requested limit
        if cur + dur > years_ahead:
            dur = years_ahead - cur
            
        seq.append({"sign": sign, "start": cur, "end": cur + dur, "duration": dur})
        cur += dur
        i += 1
        
    return seq

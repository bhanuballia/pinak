# dasha/dwisaptatisama.py
"""
Dwisaptatisama Dasha basic scaffold.
"""
from __future__ import annotations
from typing import List, Dict, Any

ORDER = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]

def compute_dwisaptatisama(start_index: int = 0, years_ahead: float = 120.0) -> List[Dict[str, Any]]:
    seq = []
    cur = 0.0
    i = start_index
    while cur < years_ahead:
        item = ORDER[i % len(ORDER)]
        dur = 10.0
        if cur + dur > years_ahead: 
            dur = years_ahead - cur
        seq.append({"item": item, "start": cur, "end": cur + dur, "duration": dur})
        cur += dur
        i += 1
    return seq

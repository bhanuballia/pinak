# dasha/ashtottari.py
"""
Ashtottari dasha basic scaffold.

Ashtottari is less commonly used and depends on tradition. We provide a
lightweight placeholder that returns a simple repeating sequence.
"""
from __future__ import annotations
from typing import List, Dict, Any

ASHTOTTARI_ORDER = ["Sun", "Moon", "Mars", "Mercury", "Saturn", "Jupiter", "Rahu", "Venus"]
ASHTOTTARI_YEARS = {
    "Sun": 6.0,
    "Moon": 15.0,
    "Mars": 8.0,
    "Mercury": 17.0,
    "Saturn": 10.0,
    "Jupiter": 19.0,
    "Rahu": 12.0,
    "Venus": 21.0
}

def compute_ashtottari(start_index: int = 0, years_ahead: float = 108.0) -> List[Dict[str, Any]]:
    seq = []
    cur = 0.0
    i = start_index
    while cur < years_ahead:
        lord = ASHTOTTARI_ORDER[i % len(ASHTOTTARI_ORDER)]
        dur = ASHTOTTARI_YEARS[lord]
        
        # Cap the final period if it exceeds the requested limit
        if cur + dur > years_ahead:
            dur = years_ahead - cur
            
        seq.append({"lord": lord, "start": cur, "end": cur + dur, "duration": dur})
        cur += dur
        i += 1
    return seq

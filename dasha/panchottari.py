# dasha/panchottari.py
"""
Panchottari Dasha basic scaffold.
"""
from __future__ import annotations
from typing import List, Dict, Any

ORDER = ["Sun", "Mercury", "Saturn", "Mars", "Venus", "Moon", "Jupiter"]
YEARS = {"Sun": 12, "Mercury": 13, "Saturn": 14, "Mars": 15, "Venus": 16, "Moon": 17, "Jupiter": 18}

def compute_panchottari(start_planet: str = "Sun", years_ahead: float = 105.0) -> List[Dict[str, Any]]:
    seq = []
    cur = 0.0
    try:
        start_index = ORDER.index(start_planet)
    except ValueError:
        start_index = 0
    i = start_index
    while cur < years_ahead:
        lord = ORDER[i % len(ORDER)]
        dur = float(YEARS[lord])
        if cur + dur > years_ahead:
            dur = years_ahead - cur
        seq.append({"lord": lord, "start": cur, "end": cur + dur, "duration": dur})
        cur += dur
        i += 1
    return seq

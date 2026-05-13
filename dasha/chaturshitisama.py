# dasha/chaturshitisama.py
"""
Chaturshitisama Dasha mathematical implementation.

Total duration = 84 years.
Applicable when 10th lord is placed in the 10th house.
Planetary Order: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn. 
*(Note: Rahu and Ketu are omitted. Every planet lasts exactly 12 years)*
"""
from __future__ import annotations
from typing import List, Dict, Any

CHATURSHITISAMA_ORDER = [
    "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"
]

CHATURSHITISAMA_YEARS = 12.0

def compute_chaturshitisama(start_planet: str = "Sun", years_ahead: float = 84.0) -> List[Dict[str, Any]]:
    """
    Produce the Chaturshitisama Dasha mathematical sequence (84 years total length).
    """
    seq = []
    cur = 0.0
    
    # Identify starting index in planetary ring
    try:
        start_index = CHATURSHITISAMA_ORDER.index(start_planet)
    except ValueError:
        start_index = 0
        
    i = start_index

    # Loop according to order appending mathematically identical 12.0 year durations
    while cur < years_ahead:
        lord = CHATURSHITISAMA_ORDER[i % len(CHATURSHITISAMA_ORDER)]
        dur = CHATURSHITISAMA_YEARS

        # Smooth cutoff logic if the iteration breaches requested limit
        if cur + dur > years_ahead:
            dur = years_ahead - cur

        seq.append({"lord": lord, "start": cur, "end": cur + dur, "duration": dur})
        cur += dur
        i += 1
        
    return seq

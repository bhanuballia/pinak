# dasha/tribhagi.py
"""
Tribhagi Dasha basic scaffold.

Tribhagi splits the Vimshottari Mahadasha length by three, reducing the 120-year cycle to 40 years.
The sequence of planets is exactly the same as Vimshottari, but the total duration shrinks.

This file provides a lightweight placeholder returning Tribhagi Dasha lengths.
"""
from __future__ import annotations
from typing import List, Dict, Any

VIMSHOTTARI_ORDER = [
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"
]
VIMSHOTTARI_YEARS = {
    "Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7,
    "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17
}

def compute_tribhagi(start_planet: str = "Ketu", years_ahead: float = 40.0) -> List[Dict[str, Any]]:
    """
    Produce a basic Tribhagi Dasha sequence (40 years total).
    The length of each Dasha is VIMSHOTTARI_YEARS / 3.
    """
    seq = []
    cur = 0.0
    try:
        start_index = VIMSHOTTARI_ORDER.index(start_planet)
    except ValueError:
        start_index = 0
        
    i = start_index

    # Create loop for Tribhagi lengths
    while cur < years_ahead:
        lord = VIMSHOTTARI_ORDER[i % len(VIMSHOTTARI_ORDER)]
        dur = VIMSHOTTARI_YEARS[lord] / 3.0  # Tribhagi logic

        if cur + dur > years_ahead:
            dur = years_ahead - cur  # Cutoff smoothly

        seq.append({"lord": lord, "start": cur, "end": cur + dur, "duration": dur})
        cur += dur
        i += 1
        
    return seq

# dasha/shodashottari.py
"""
Shodashottari Dasha mathematical implementation.

Total duration = 116 years.
Applicable conditionally according to Parashara (e.g., birth in day time in Krishna Paksha,
or night time in Shukla Paksha).
Planetary Order and Durations: 
Sun (11), Mars (12), Jupiter (13), Saturn (14), Ketu (15), Moon (16), Mercury (17), Venus (18). 
*(Note: Rahu is omitted in this system)*
"""
from __future__ import annotations
from typing import List, Dict, Any

SHODASHOTTARI_ORDER: List[str] = [
    "Sun", "Mars", "Jupiter", "Saturn", "Ketu", "Moon", "Mercury", "Venus"
]

SHODASHOTTARI_YEARS: Dict[str, float] = {
    "Sun": 11.0, 
    "Mars": 12.0, 
    "Jupiter": 13.0, 
    "Saturn": 14.0, 
    "Ketu": 15.0, 
    "Moon": 16.0, 
    "Mercury": 17.0, 
    "Venus": 18.0
}

def get_start_index(planet: str) -> int:
    try:
        return SHODASHOTTARI_ORDER.index(planet)
    except ValueError:
        return 0

def compute_shodashottari(start_planet: str = "Sun", years_ahead: float = 116.0) -> List[Dict[str, Any]]:
    """
    Produce the Shodashottari Dasha mathematical sequence (116 years total length).
    """
    seq = []
    cur = 0.0
    
    # Identify starting index in planetary ring
    start_index: int = get_start_index(start_planet)

    # Loop according to order appending exact Shodashottari planetary durations
    iteration: int = 0
    while cur < years_ahead:
        current_idx = (start_index + iteration) % len(SHODASHOTTARI_ORDER)
        lord = SHODASHOTTARI_ORDER[current_idx]
        dur = SHODASHOTTARI_YEARS[lord]

        # Smooth cutoff logic if the iteration breaches requested limit
        if cur + dur > years_ahead:
            dur = years_ahead - cur

        seq.append({"lord": lord, "start": cur, "end": cur + dur, "duration": dur})
        cur += dur
        iteration = int(iteration + 1)
        
    return seq

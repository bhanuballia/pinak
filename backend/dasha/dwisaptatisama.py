# dasha/dwisaptatisama.py
"""
Dwisaptatisama Dasha calculation.
Total years = 72.
"""
from __future__ import annotations
from typing import List, Dict, Any

ORDER = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu"]
YEARS = {k: 9 for k in ORDER}

def compute_dwisaptatisama(moon_lon: float, years_ahead: float = 72.0) -> List[Dict[str, Any]]:
    nak_deg = 360 / 27
    nak_idx = int(moon_lon // nak_deg) % 27
    pos_in_nak = (moon_lon % nak_deg) / nak_deg
    
    # Count from Mula (idx 18) to Janma Nakshatra
    # Distance = (nak_idx - 18) % 27 + 1
    distance = (nak_idx - 18) % 27 + 1
    rem = distance % 8
    
    start_lord_idx = (rem - 1) % 8 if rem != 0 else 7
    
    start_lord = ORDER[start_lord_idx]
    total_dur = YEARS[start_lord]
    balance = total_dur * (1.0 - pos_in_nak)
    
    seq = []
    cur = 0.0
    
    seq.append({
        "item": start_lord,
        "start": cur,
        "end": balance,
        "duration": balance
    })
    cur += balance
    
    i = start_lord_idx + 1
    while cur < years_ahead:
        lord = ORDER[i % len(ORDER)]
        dur = YEARS[lord]
        
        if cur + dur > years_ahead:
            dur = years_ahead - cur
            
        seq.append({"item": lord, "start": cur, "end": cur + dur, "duration": dur})
        cur += dur
        i += 1
        
    return seq

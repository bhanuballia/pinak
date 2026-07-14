# dasha/dwadashottari.py
"""
Dwadashottari Dasha calculation.
Total years = 112.
"""
from __future__ import annotations
from typing import List, Dict, Any

ORDER = ["Sun", "Jupiter", "Ketu", "Mercury", "Rahu", "Mars", "Saturn", "Moon"]
YEARS = {
    "Sun": 7, "Jupiter": 9, "Ketu": 11, "Mercury": 13, 
    "Rahu": 15, "Mars": 17, "Saturn": 19, "Moon": 21
}

def compute_dwadashottari(moon_lon: float, years_ahead: float = 112.0) -> List[Dict[str, Any]]:
    nak_deg = 360 / 27
    nak_idx = int(moon_lon // nak_deg) % 27
    pos_in_nak = (moon_lon % nak_deg) / nak_deg
    
    # Count from Janma Nakshatra to Revati (idx 26)
    # Both inclusive: distance = 26 - nak_idx + 1
    distance = 26 - nak_idx + 1
    rem = distance % 8
    
    # Remainder mapping: 1=Sun, 2=Jupiter, 3=Ketu, 4=Mercury, 5=Rahu, 6=Mars, 7=Saturn, 0=Moon
    # In 0-indexed list ORDER: 1->0, 2->1, 3->2, 4->3, 5->4, 6->5, 7->6, 0->7
    start_lord_idx = (rem - 1) % 8 if rem != 0 else 7
    
    start_lord = ORDER[start_lord_idx]
    total_dur = YEARS[start_lord]
    balance = total_dur * (1.0 - pos_in_nak)
    
    seq = []
    cur = 0.0
    
    # First dasha
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

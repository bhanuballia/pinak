# dasha/ashtottari.py
"""
Ashtottari dasha basic scaffold.

Ashtottari is less commonly used and depends on tradition. We provide a
lightweight placeholder that returns a simple repeating sequence.
"""
from __future__ import annotations
from typing import List, Dict, Any

ASHTOTTARI_ORDER = ["Saturn","Jupiter","Mars","Sun","Mercury","Ketu","Venus","Moon","Rahu"]
ASHTOTTARI_YEARS = {k: 9 for k in ASHTOTTARI_ORDER}  # placeholder

def compute_ashtottari(start_index: int = 0, years_ahead: int = 50) -> List[Dict[str, Any]]:
    seq = []
    cur = 0.0
    i = start_index
    while cur < years_ahead:
        lord = ASHTOTTARI_ORDER[i % len(ASHTOTTARI_ORDER)]
        dur = ASHTOTTARI_YEARS[lord]
        seq.append({"lord": lord, "start": cur, "end": cur + dur, "duration": dur})
        cur += dur
        i += 1
    return seq

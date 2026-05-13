# charts/divisional/d60.py
"""
D60 (Shastiamsa) helper utilities.

D60 divides the zodiac into 60 parts, each 6 degrees (or other schemes based on
traditions). The simplest and widely-used mapping is:
  - d60_index = floor(longitude / (360/60)) = floor(longitude / 6)
  - sign_index = d60_index % 12
This module returns index, sign, degrees inside the segment.
"""
from __future__ import annotations
import math
from typing import Tuple

D60_DIVISIONS = 60
D60_SIZE_DEG = 360.0 / D60_DIVISIONS  # 6.0

def d60_from_longitude(long_deg: float) -> Tuple[int, int, float]:
    """
    Return (d60_index 0..59, sign_index 0..11, deg_inside 0..6)
    """
    long_deg = long_deg % 360.0
    idx = int(math.floor(long_deg / D60_SIZE_DEG))
    idx = min(max(idx, 0), D60_DIVISIONS - 1)
    sign_idx = idx % 12
    start = idx * D60_SIZE_DEG
    deg_inside = long_deg - start
    if deg_inside < 0:
        deg_inside += D60_SIZE_DEG
    return idx, sign_idx, deg_inside

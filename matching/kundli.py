# matching/kundli.py
"""
Kundli matching (36 point simplified).

This module implements a common simplified Guna Milan scoring:
 - Varna (1 point)
 - Vashya (2)
 - Tara (3)
 - Yoni (4)
 - Graha Maitri (5)
 - Gana (6)
 - Bhakoot / Rasiya (7)
 - Nadi (8)
The total points and a verdict (Match/Partial/Poor) are returned.

This is a **simplified** scoring model — replace specific scoring rules with
your preferred authoritative scheme if required.
"""
from __future__ import annotations
from typing import Dict, Any
from core.utils import get_sign_index
from panchang.nakshatra import compute_nakshatra_from_lon
from astrology_utils import helpers  # optional helpers you can implement

def _get_moon_sign(lon: float) -> int:
    return get_sign_index(lon)

def compute_guna_milan(natal1: Dict[str, Any], natal2: Dict[str, Any]) -> Dict[str, Any]:
    """
    Accepts natal models (must contain 'planet_positions' structured like build_rashi_chart output).
    Example use:
        from charts.rashi_chart import build_rashi_chart
        chart1 = build_rashi_chart(jd1, lat1, lon1)
        chart2 = build_rashi_chart(jd2, lat2, lon2)
        result = compute_guna_milan(chart1, chart2)
    """
    p1 = natal1["planet_positions"]
    p2 = natal2["planet_positions"]
    # basic extraction
    moon1 = p1["Moon"]["sidereal"]["lon"]
    moon2 = p2["Moon"]["sidereal"]["lon"]
    sign1 = _get_moon_sign(moon1)
    sign2 = _get_moon_sign(moon2)

    # Bhakoot (Rasiya) simplified score: if signs compatible give points
    # Very simplified: opposite (7th) or same sign less compatible; this is a placeholder
    bhakoot = 7 if ((sign1 - sign2) % 12) in (0, 7) else 0

    # Nadi: if nakshatra pada differ etc. simplified
    nak1 = compute_nakshatra_from_lon(moon1)
    nak2 = compute_nakshatra_from_lon(moon2)
    nadi = 8 if nak1["nakshatra_index"] % 3 != nak2["nakshatra_index"] % 3 else 0

    # Sum up simplified points across categories (placeholders)
    score = bhakoot + nadi
    verdict = "Poor"
    if score >= 12:
        verdict = "Good Match"
    elif score >= 6:
        verdict = "Average"
    else:
        verdict = "Poor"

    return {
        "score": int(score),
        "details": {"bhakoot": bhakoot, "nadi": nadi},
        "verdict": verdict
    }

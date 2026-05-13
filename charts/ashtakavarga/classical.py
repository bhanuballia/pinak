"""
Minimal Sarvashtakavarga computation helper.

This module deliberately keeps the logic lightweight so that the PDF
generator can always render the Ashtakavarga wheel even when the full
classical implementation is not available.

The returned structure is compatible with charts.renderers.ashtakavarga_wheel_renderer:

{
    "scores": [12 integers],
    "planet_scores": {
        "Sun": [...],
        ...
    }
}
"""

from __future__ import annotations

from typing import Dict, Any, List

from charts.rashi_chart import build_rashi_chart

PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]


def _safe_house(houses: Dict[Any, Any], idx: int) -> Dict[str, Any]:
    return houses.get(idx) or houses.get(str(idx), {}) or {}


def compute_ashtakavarga_classical(jd_ut: float, lat: float, lon: float) -> Dict[str, Any]:
    """
    Return a simple Sarvashtakavarga-style data structure based on the
    currently available D1 (rāśi) chart. The scores are heuristic (baseline 20
    bindus with small adjustments per occupant) but deterministic, so the wheel
    renderer can always visualise something meaningful.
    """
    chart = build_rashi_chart(jd_ut, lat, lon, house_system="W", style="north")
    houses = chart.get("houses", {})

    scores: List[int] = []
    planet_scores: Dict[str, List[int]] = {p: [0] * 12 for p in PLANETS}

    for idx in range(1, 13):
        house_info = _safe_house(houses, idx)
        occupants = house_info.get("planets", [])

        # Baseline 20 bindus + 2 per planet in the house.
        base_score = 20 + 2 * len(occupants)

        # Give a small boost if the sign ruler matches one of the occupants.
        sign_lord = house_info.get("sign_lord")
        if sign_lord and sign_lord in occupants:
            base_score += 3

        scores.append(base_score)

        for planet in occupants:
            if planet in planet_scores:
                planet_scores[planet][idx - 1] = 1

    return {
        "scores": scores,
        "planet_scores": planet_scores,
    }


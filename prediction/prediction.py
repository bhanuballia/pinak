# prediction/prediction.py
"""
Simple prediction engine combining dashas and transits.

Given natal chart and current JD, it returns:
 - Current dasha (via vimshottari)
 - Upcoming transit highlights (planets approaching natal positions)
 - A templated natural-language prediction combining both (short)

This is a template generator — customize language & rules as you prefer.
"""
from __future__ import annotations
from typing import Dict, Any, List
from dasha.vimshottari import compute_vimshottari
from transit.transit import upcoming_transit_windows, current_transits

def predict_simple(natal_chart: Dict[str, Any], birth_jd: float, jd_now: float, days_ahead: int = 90) -> Dict[str, Any]:
    # get nakshatra index
    from panchang.nakshatra import compute_nakshatra_from_lon
    moon_lon = natal_chart["planet_positions"]["Moon"]["sidereal"]["lon"]
    nak = compute_nakshatra_from_lon(moon_lon)
    nak_index = nak["nakshatra_index"]

    dashas = compute_vimshottari(birth_jd, nak_index, years_ahead=120)

    # current dasha: first where start <= 0 < end (our compute uses relative years starting 0 at birth)
    current = dashas[0] if dashas else None

    trans = current_transits(natal_chart["planet_positions"], jd_now, orb=2.0)
    upcoming = upcoming_transit_windows(natal_chart["planet_positions"], __import__("datetime").datetime.utcnow(), days_ahead=days_ahead)

    # generate a short templated text
    lines = []
    if current:
        lines.append(f"Current Mahadasha: {current['lord']} ({current['start_year']} - {current['end_year']} years from birth).")
    if trans:
        for t in trans:
            lines.append(f"Transit: {t['planet']} is within {t['distance']:.2f}° of natal position — notable transit.")
    pred_text = " ".join(lines) if lines else "No immediate prediction from the simple engine."

    return {"dasha": current, "transits_now": trans, "upcoming_transits": upcoming[:10], "text": pred_text}

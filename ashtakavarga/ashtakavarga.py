# ashtakavarga/ashtakavarga.py
"""
Classical Ashtakavarga (Bhinnashtakavarga + Sarvashtakavarga) implementation.

Algorithm:
- Uses 8 donors: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Lagna (Ascendant).
- For each recipient R (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Lagna),
  there is a donor->favorable-house list (classical table).
- For each donor D: determine donor_sign = sign index where D sits (0..11).
  For each favorable house number h in the table for recipient R and donor D:
      target_sign = (donor_sign + (h - 1)) % 12
      increment Bhinnashtakavarga[R][target_sign] by 1
- Bhinnashtakavarga[R] (per recipient) thus accumulates 0..8 bindus per sign.
- Sarvashtakavarga is the sum of all Bhinnashtakavarga columns (per sign totals).

References / rule sources:
- Consolidated tables and rules (commonly used): ashtakvarga.in (summary of donor→house mapping)
- Classical printed sources (e.g., C.S. Patel, M. S. Mehta) provide the same tables.
"""
from __future__ import annotations

from typing import Dict, List, Any, Tuple
from collections import defaultdict

from core.utils import get_sign_index, normalize_angle
from astronomy.positions import get_all_planetary_positions
from astronomy.ascendant import get_ascendant, get_ascendant_from_datetime

# Recipient list (order kept for clarity)
RECIPIENTS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Lagna"]

# Classical donor -> favorable houses lists for each recipient.
# These lists are "house numbers" relative to donor's sign (1 = donor's sign itself).
# Source: consolidated from classical tables (C.S. Patel / ashtakvarga.in / Mehta notes).
# NOTE: These are recipient-centric: for recipient R, donor D gives bindus to the listed houses.
_ASHTAK_TABLE: Dict[str, Dict[str, List[int]]] = {
    "Sun": {
        "Sun":   [1,4,7,10,8,2,9,11],
        "Moon":  [3,6,10,11],
        "Mars":  [1,4,7,10,8,2,9,11],
        "Mercury":[3,6,10,11,5,9,12],
        "Jupiter":[5,6,9,11],
        "Venus":[6,7,12],
        "Saturn":[1,4,7,10,8,2,9,11],
        "Lagna":[3,4,6,10,11,12],
    },
    "Moon": {
        "Sun":[3,6,7,8,10,11],
        "Moon":[1,3,6,7,10,11],
        "Mars":[2,3,5,6,9,10,11],
        "Mercury":[1,3,4,5,7,8,10,11],
        "Jupiter":[1,4,7,8,10,11,12],
        "Venus":[3,4,5,7,9,10,11],
        "Saturn":[3,5,6,11],
        "Lagna":[3,6,10,11],
    },
    "Mars": {
        "Sun":[3,5,6,10,11],
        "Moon":[3,6,11],
        "Mars":[1,2,4,7,8,10,11],
        "Mercury":[3,5,6,11],
        "Jupiter":[6,10,11,12],
        "Venus":[6,8,11,12],
        "Saturn":[1,4,7,8,9,10,11],
        "Lagna":[1,3,6,10,11],
    },
    "Mercury": {
        "Sun":[1,3,5,6,9,10,11,12],
        "Moon":[2,4,6,8,10,11],
        "Mars":[1,2,4,7,8,9,10,11],
        "Mercury":[1,3,5,6,9,10,11,12],
        "Jupiter":[6,8,11,12],
        "Venus":[1,2,3,4,5,9,10,11],
        "Saturn":[1,2,4,7,8,9,10,11],
        "Lagna":[1,2,4,6,8,10,11],
    },
    "Jupiter": {
        "Sun":[1,2,3,4,7,8,9,10,11],
        "Moon":[2,5,7,9,11],
        "Mars":[1,2,4,7,8,10,11],
        "Mercury":[1,2,4,5,6,9,10,11],
        "Jupiter":[1,2,3,4,7,8,10,11],
        "Venus":[2,5,6,9,10,11],
        "Saturn":[3,5,6,12],
        "Lagna":[1,2,4,5,6,9,10,11],
    },
    "Venus": {
        "Sun":[8,11,12],
        "Moon":[1,2,3,4,5,8,9,11,12],
        "Mars":[3,5,6,9,11,12],
        "Mercury":[3,5,6,9,11],
        "Jupiter":[5,8,9,10,11],
        "Venus":[1,2,3,4,5,8,9,10,11],
        "Saturn":[3,4,5,8,9,10,11],
        "Lagna":[1,2,3,4,5,8,9,11],
    },
    "Saturn": {
        "Sun":[1,2,4,7,8,10,11],
        "Moon":[3,6,11],
        "Mars":[3,5,6,10,11,12],
        "Mercury":[6,8,9,10,11,12],
        "Jupiter":[5,6,11,12],
        "Venus":[6,11,12],
        "Saturn":[3,5,6,11],
        "Lagna":[1,3,4,6,10,11],
    },
    "Lagna": {  # Lagna (Ascendant) recipient — donors listed as per classical table
        "Sun":[3,4,6,10,11,12],
        "Moon":[3,6,10,11,12],
        "Mars":[1,3,6,10,11],
        "Mercury":[1,2,4,6,8,10,11],
        "Jupiter":[1,2,4,5,6,7,9,10,11],
        "Venus":[1,2,3,4,5,8,9],
        "Saturn":[1,3,4,6,10,11],
        "Lagna":[3,6,10,11],
    },
}


def _empty_bhinnashtakavarga_structure() -> Dict[str, List[int]]:
    """Return recipient->12-element zero list (0..11 signs)."""
    return {r: [0] * 12 for r in RECIPIENTS}


def compute_bhinnashtakavarga_for_positions(
    planet_positions: Dict[str, Dict[str, Any]],
    ascendant_deg: float
) -> Dict[str, List[int]]:
    """
    Compute Bhinnashtakavarga for the 8 recipients based on current planet positions.

    Args:
        planet_positions: output from astronomy.positions.get_all_planetary_positions()
                           Example: planet_positions['Sun']['sidereal']['lon'] -> degrees
        ascendant_deg: ascendant (lagna) longitude in sidereal degrees (0..360)

    Returns:
        Dict mapping recipient -> list of 12 integers (bindus 0/1..up to 8)
    """
    # Ensure the recipients/donors exist in positions
    # For Lagna donor we use ascendant_deg (not a planet)
    bhinn = _empty_bhinnashtakavarga_structure()

    # Precompute donor signs
    donor_sign_map: Dict[str, int] = {}
    for donor in ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]:
        lon = float(planet_positions[donor]["sidereal"]["lon"])
        donor_sign_map[donor] = get_sign_index(lon)
    donor_sign_map["Lagna"] = get_sign_index(ascendant_deg)

    # For each recipient, iterate donors and apply classical favorable houses
    for recipient in RECIPIENTS:
        table_for_recipient = _ASHTAK_TABLE.get(recipient, {})
        for donor, favored_houses in table_for_recipient.items():
            donor_sign = donor_sign_map.get(donor)
            if donor_sign is None:
                # safety: skip if donor missing
                continue
            for house_num in favored_houses:
                # house numbers are 1..12 relative to donor sign
                target_sign = (donor_sign + (house_num - 1)) % 12
                # Mark bindu (add 1). Multiple donors may contribute more than 1.
                bhinn[recipient][target_sign] += 1

    return bhinn


def compute_sarvashtakavarga_from_bhinns(bhinn: Dict[str, List[int]]) -> List[int]:
    """
    Sum columns across all recipients (including Lagna) to produce Sarvashtakavarga totals for 12 signs.

    Returns list of 12 integers (total bindus per sign).
    """
    totals = [0] * 12
    for recipient_vals in bhinn.values():
        for i in range(12):
            totals[i] += int(recipient_vals[i])
    return totals


def compute_ashtakavarga(jd_ut: float, lat: float, lon: float, house_system: str = "W") -> Dict[str, Any]:
    """
    High-level function computing Bhinnashtakavarga and Sarvashtakavarga for a given birth/time and place.

    Args:
      - jd_ut: Julian Day (UT)
      - lat, lon: geographic coords (for Ascendant)
      - house_system: forwarded to get_ascendant to compute Lagna (default "W" is fine)

    Returns:
      {
        "bhinnashtakavarga": { recipient: [12-int-list], ... },
        "sarvashtakavarga": [12-int-list],
        "house_strengths": { house_no (1..12): { "sign_index": int, "bindus": int, "percent": float } },
        "total_bindus": int
      }
    """
    # Obtain planet positions and ascendant
    planet_positions = get_all_planetary_positions(jd_ut)
    asc = get_ascendant(jd_ut, lat, lon, house_system=house_system)
    asc_deg = float(asc["ascendant_deg"])

    bhinn = compute_bhinnashtakavarga_for_positions(planet_positions, asc_deg)
    sarva = compute_sarvashtakavarga_from_bhinns(bhinn)
    total_bindus = sum(sarva)

    # Build per-house details (house numbers 1..12) — determine sign at each house cusp
    # We need house cusps to know which sign corresponds to each bhava; reuse compute_whole_sign_houses
    from charts.houses import compute_houses
    houses_data = compute_houses(jd_ut, lat, lon, system=house_system)
    cusps = houses_data["cusps"]  # [None, c1..c12]
    house_strengths = {}
    for h in range(1, 13):
        cusp_deg = cusps[h]
        sign_idx = get_sign_index(cusp_deg)
        bindus = sarva[sign_idx]
        percent = (bindus / 337.0) * 100.0 if total_bindus > 0 else 0.0
        house_strengths[h] = {
            "sign_index": int(sign_idx),
            "sign_name": None,
            "cusp_deg": float(cusp_deg),
            "bindus": int(bindus),
            "percent_of_total": float(percent)
        }

    return {
        "bhinnashtakavarga": bhinn,
        "sarvashtakavarga": sarva,
        "house_strengths": house_strengths,
        "total_bindus": int(total_bindus),
    }


# Convenience CLI demo
if __name__ == "__main__":
    import datetime
    from astronomy.julian import datetime_to_julian
    from core.utils import get_sign_name

    dt = datetime.datetime(2024, 1, 1, 0, 0)
    jd = datetime_to_julian(dt)
    lat = 28.6139
    lon = 77.2090

    out = compute_ashtakavarga(jd, lat, lon)
    print("Sarvashtakavarga totals (per sign 0..11):", out["sarvashtakavarga"])
    print("Total bindus:", out["total_bindus"])
    print("Bhinnashtakavarga (Sun):", out["bhinnashtakavarga"]["Sun"])
    # show house strengths
    for h, info in out["house_strengths"].items():
        sname = get_sign_name(info["sign_index"] * 30.0)
        print(f"House {h}: sign {sname}, bindus={info['bindus']}, {info['percent_of_total']:.1f}%")

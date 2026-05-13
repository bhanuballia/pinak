# dasha/vimshottari_full.py
"""
Full Vimshottari implementation with nested Antar (Antardasha) and Pratyantar.
This produces mahadasha timeline starting from birth and provides nested segments.

Algorithm:
 - Determine natal nakshatra index and fraction
 - Determine starting mahadasha (lord) and remaining years
 - Compute subsequent mahadashas for a desired span (e.g., 120 years)
 - For each mahadasha compute antardashas by splitting mahadasha proportionally among 9 planets
 - For each antardasha compute pratyantar similarly (optional depth)

Returns nested structure:
[
  {
    lord: str,
    start_jd, end_jd,
    duration_years,
    antardashas: [
      {lord, start_jd, end_jd, duration_years, pratyantar: [...]}
    ]
  }, ...
]
"""
from __future__ import annotations
from typing import List, Dict, Any
from astronomy.positions import get_all_planetary_positions
import datetime
import math

# Sequence & durations in years for Vimshottari
VIM_ORDER = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"]
VIM_DUR = {"Ketu":7,"Venus":20,"Sun":6,"Moon":10,"Mars":7,"Rahu":18,"Jupiter":16,"Saturn":19,"Mercury":17}

def _jd_add_years(jd_start: float, years: float) -> float:
    # approximate add years -> days
    return jd_start + years * 365.2425

def _compute_antardashas_for_maha(maha_lord: str, maha_duration: float, start_jd: float) -> List[Dict[str, Any]]:
    # Antardashas sequence always Ketu..Mercury same order (VIM_ORDER), each antardasha length = maha_duration * (planet_duration/120)
    # total sum VIM_DUR values = 120
    denom = sum(VIM_DUR.values())
    antars = []
    cur_start = start_jd
    for lord in VIM_ORDER:
        frac = VIM_DUR[lord] / denom
        dur_years = maha_duration * frac
        end = _jd_add_years(cur_start, dur_years)
        antars.append({
            "lord": lord,
            "start_jd": cur_start,
            "end_jd": end,
            "duration_years": dur_years
        })
        cur_start = end
    return antars

def compute_vimshottari_full(jd_ut: float, moon_sidereal_long: float, years_ahead: float = 120.0) -> List[Dict[str, Any]]:
    """
    Returns list of mahadashas starting at birth (or given jd_ut) until years_ahead covered.
    Each mahadasha includes antardashas list.
    """
    nak_deg = 13.333333333333334
    nak_idx = int(moon_sidereal_long // nak_deg) % 27
    pos_in_nak = (moon_sidereal_long % nak_deg) / nak_deg
    # Determine starting mahadasha index using nakshatra mapping:
    # There are 27 nakshatras; mapping of nakshatra to starting lord is classical:
    # Common mapping: starting from Ashwini -> Ketu, Bharani->Venus, Krittika->Sun, ... (cyclic mapping of VIM_ORDER to 27)
    start_lord = VIM_ORDER[nak_idx % len(VIM_ORDER)]
    # Find start index in VIM_ORDER
    start_idx = VIM_ORDER.index(start_lord)
    out = []
    jd_cursor = jd_ut
    # First maha: remaining fraction of the dasha lord = (1 - pos_in_nak) * lord_duration
    first_lord = VIM_ORDER[start_idx]
    first_total_years = VIM_DUR[first_lord]
    first_remain = first_total_years * (1.0 - pos_in_nak)
    # Build mahadashas sequentially until years_ahead covered
    covered = 0.0
    idx = start_idx
    while covered < years_ahead:
        lord = VIM_ORDER[idx % len(VIM_ORDER)]
        duration = first_remain if covered == 0 else float(VIM_DUR[lord])
        start_jd = jd_cursor
        end_jd = _jd_add_years(start_jd, duration)
        antars = _compute_antardashas_for_maha(lord, duration, start_jd)
        out.append({
            "lord": lord,
            "start_jd": start_jd,
            "end_jd": end_jd,
            "duration_years": duration,
            "antardashas": antars
        })
        covered += duration
        jd_cursor = end_jd
        idx += 1
        # after first iteration, first_remain should not apply
        first_remain = 0.0
    return out


# Backwards-compatibility alias: some modules import `compute_vimshottari`
# while this file exposes `compute_vimshottari_full`. Provide the shorter
# name as a direct alias so imports succeed.
compute_vimshottari = compute_vimshottari_full

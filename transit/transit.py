"""
Transit computations and helpers (single clean copy).
"""

from __future__ import annotations
from typing import Dict, Any, List
import datetime

from astronomy.julian import datetime_to_julian
from astronomy.positions import get_all_planetary_positions


def angular_distance(a: float, b: float) -> float:
    return abs(((a - b + 180) % 360) - 180)


def current_transits(natal_positions: Dict[str, Any], jd_ut_now: float, orb: float = 2.0) -> List[Dict[str, Any]]:
    transits = []
    now_positions = get_all_planetary_positions(jd_ut_now)
    for pname, natal_data in natal_positions.items():
        natal_lon = natal_data["sidereal"]["lon"]
        if pname not in now_positions:
            continue
        trans_lon = now_positions[pname]["sidereal"]["lon"]
        d = angular_distance(natal_lon, trans_lon)
        if d <= orb:
            transits.append({"planet": pname, "natal_lon": natal_lon, "transit_lon": trans_lon, "distance": d})
    return transits


def upcoming_transit_windows(natal_positions: Dict[str, Any], start_dt: datetime.datetime, days_ahead: int = 90, step_days: float = 1.0, orb: float = 2.0) -> List[Dict[str, Any]]:
    jd_start = datetime_to_julian(start_dt)
    windows = []
    steps = int(days_ahead / step_days)
    for i in range(steps + 1):
        jd = jd_start + i * step_days
        now_positions = get_all_planetary_positions(jd)
        for pname, natal_data in natal_positions.items():
            natal_lon = natal_data["sidereal"]["lon"]
            if pname not in now_positions:
                continue
            trans_lon = now_positions[pname]["sidereal"]["lon"]
            d = angular_distance(natal_lon, trans_lon)
            if d <= orb:
                windows.append({"date_jd": jd, "planet": pname, "distance": d, "transit_lon": trans_lon, "natal_lon": natal_lon})
    return windows

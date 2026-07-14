# charts/lagna.py
"""
Compatibility shim: expose simple lagna (ascendant) helpers used by UI.
Wraps astronomy.ascendant functions.
"""
from __future__ import annotations

from typing import Dict, Any
import datetime

from astronomy.ascendant import get_ascendant_from_datetime, get_ascendant


def compute_lagna_from_datetime(
    dt: datetime.datetime,
    lat: float,
    lon: float,
    tz_offset_hours: float = 0.0,
    house_system: str = "P",
) -> Dict[str, Any]:
    """
    Convenience wrapper returning ascendant details given local datetime.
    """
    return get_ascendant_from_datetime(dt, lat, lon, tz_offset_hours, house_system)


def compute_lagna_from_jd(jd_ut: float, lat: float, lon: float, house_system: str = "P") -> Dict[str, Any]:
    return get_ascendant(jd_ut, lat, lon, house_system)

# astronomy/ascendant.py
"""
Ascendant (Lagna) and house-cusp helpers.

Provides:
- get_ascendant(jd_ut, lat, lon, house_system='P')
- get_ascendant_from_datetime(dt, lat, lon, tz_offset_hours=0.0, house_system='P')
- get_house_cusps(jd_ut, lat, lon, house_system='P')

Notes:
- jd_ut must be a Julian Day in UT (use astronomy.julian.datetime_to_julian to convert).
- lat, lon in decimal degrees (latitude: north positive, longitude: east positive).
- house_system is forwarded to pyswisseph when supported (common codes: 'P' = Placidus,
  'K' = Koch, 'W' = Whole sign, 'B' = Equal (topocentric), etc.). If the installed
  pyswisseph build doesn't accept the house_system parameter, the code falls back to
  the default swe.houses(jd_ut, lat, lon) behavior.
"""

from __future__ import annotations

import logging
import datetime
from typing import Dict, Any, List, Optional

try:
    import swisseph as swe
except Exception:  # pragma: no cover - allow import without pyswisseph
    swe = None

from astronomy.julian import datetime_to_julian
from astronomy.sidereal import set_ayanamsa
from core.utils import normalize_angle, get_sign_index, get_sign_name

logger = logging.getLogger(__name__)
logger.addHandler(logging.NullHandler())


def _call_houses(jd_ut: float, lat: float, lon: float, house_system: str = "P"):
    """
    Wrapper around swisseph.houses to support differing pyswisseph signatures.

    Returns:
        (cusps_list[1..12], ascmc_list)  -- mirrors swisseph.houses.
    """
    # Ensure sidereal mode is set (important for Vedic charts)
    try:
        set_ayanamsa()
    except Exception:
        # Not fatal here; continue — swisseph may still compute houses (but warn)
        logger.debug("set_ayanamsa() raised; proceeding without re-setting sidereal mode.")

    # In Vedic astrology, we expect sidereal positions.
    # We use FLG_SIDEREAL to get sidereal house cusps and angles.
    try:
        # Try houses_ex first as it supports flags (like FLG_SIDEREAL)
        # house_system must be bytes in some pyswisseph versions
        hsys = house_system.encode('utf-8') if isinstance(house_system, str) else house_system
        res = swe.houses_ex(jd_ut, lat, lon, hsys, swe.FLG_SIDEREAL)
        return res
    except (AttributeError, TypeError):
        # Fallback to standard houses if houses_ex is not available or has different signature.
        # Note: swe.houses usually returns TROPICAL positions.
        try:
            res = swe.houses(jd_ut, lat, lon, house_system)
            return res
        except Exception as exc:
            logger.exception("swe.houses failed: %s", exc)
            raise RuntimeError("Unable to compute houses using swisseph.") from exc
    except Exception as exc:
        # Unexpected error
        logger.exception("swe.houses_ex failed with house_system=%s: %s", house_system, exc)
        raise RuntimeError("Unable to compute houses using swisseph.") from exc


def get_house_cusps(jd_ut: float, lat: float, lon: float, house_system: str = "P") -> Dict[str, Any]:
    """
    Return house cusps and core angles (Ascendant, MC, Vertex if available).

    Returns dictionary:
    {
        "cusps": [None, cusp1, cusp2, ..., cusp12],   # index 1..12 (0 is None to align)
        "ascendant_deg": float,
        "mc_deg": float,
        "vertex_deg": Optional[float],   # if available
        "house_system": str
    }
    """
    res = _call_houses(jd_ut, lat, lon, house_system)
    if not isinstance(res, (list, tuple)) or len(res) < 2:
        raise RuntimeError("Unexpected result from swisseph.houses")

    cusps, ascmc = res[0], res[1]

    # Ensure cusps is 1-indexed list for convenience: insert placeholder at index 0
    cusps_list: List[Optional[float]] = [None] + list(cusps[:12])  # ensure length >= 13

    # Ascendant is typically ascmc[0], MC ascmc[1], vertex ascmc[2] (if present)
    asc_deg = None
    mc_deg = None
    vertex_deg = None

    try:
        if ascmc and len(ascmc) >= 1:
            asc_deg = float(ascmc[0])
        if ascmc and len(ascmc) >= 2:
            mc_deg = float(ascmc[1])
        if ascmc and len(ascmc) >= 3:
            vertex_deg = float(ascmc[2])
    except Exception:
        # Fallback: try to take first cusp as ascendant (not ideal)
        logger.debug("Failed to parse ascmc; falling back to cusp[1] for ascendant.")
        asc_deg = float(cusps_list[1]) if cusps_list[1] is not None else None

    # Normalize degrees
    if asc_deg is not None:
        asc_deg = normalize_angle(asc_deg)
    if mc_deg is not None:
        mc_deg = normalize_angle(mc_deg)
    if vertex_deg is not None:
        vertex_deg = normalize_angle(vertex_deg)

    return {
        "cusps": cusps_list,
        "ascendant_deg": asc_deg,
        "mc_deg": mc_deg,
        "vertex_deg": vertex_deg,
        "house_system": house_system,
    }


def get_ascendant(jd_ut: float, lat: float, lon: float, house_system: str = "P") -> Dict[str, Any]:
    """
    Compute the Ascendant (Lagna) and return structured information.

    Output:
    {
        "ascendant_deg": float,           # 0..360 degrees
        "ascendant_sign_index": int,      # 0..11 (Aries=0)
        "ascendant_sign": str,            # sign name
        "ascendant_in_sign_deg": float,   # degrees inside the sign (0..30)
        "mc_deg": float,                  # medium coeli (if available)
        "cusps": [None, c1, c2, ..., c12] # house cusps
    }
    """
    data = get_house_cusps(jd_ut, lat, lon, house_system)
    asc_deg = data.get("ascendant_deg")
    mc_deg = data.get("mc_deg")
    cusps = data.get("cusps")

    if asc_deg is None:
        raise RuntimeError("Ascendant could not be computed for the provided inputs.")

    asc_deg = normalize_angle(float(asc_deg))
    sign_index = get_sign_index(asc_deg)
    sign_name = get_sign_name(asc_deg)
    deg_in_sign = asc_deg - (sign_index * 30.0)
    if deg_in_sign < 0:
        # defensive normalization
        deg_in_sign += 30.0

    return {
        "ascendant_deg": asc_deg,
        "ascendant_sign_index": int(sign_index),
        "ascendant_sign": sign_name,
        "ascendant_in_sign_deg": float(deg_in_sign),
        "mc_deg": mc_deg,
        "cusps": cusps,
        "house_system": house_system,
    }


def get_ascendant_from_datetime(
    dt: datetime.datetime,
    lat: float,
    lon: float,
    tz_offset_hours: float = 0.0,
    house_system: str = "P",
) -> Dict[str, Any]:
    """
    Convenience wrapper that accepts a local datetime + timezone offset (hours),
    converts to Julian Day UT, and returns the ascendant structure (see get_ascendant).

    Parameters:
    - dt: naive or timezone-aware datetime that represents local time at birth.
    - lat: latitude (north positive)
    - lon: longitude (east positive)
    - tz_offset_hours: e.g., India (Asia/Kolkata) = +5.5

    Note:
    - If dt is timezone-aware, tz_offset_hours is ignored and dt converted to UTC.
    """
    # If datetime is timezone-aware, convert to UTC first and ignore tz_offset_hours
    if dt.tzinfo is not None:
        dt_utc = dt.astimezone(datetime.timezone.utc).replace(tzinfo=None)
    else:
        # Treat dt as local time and subtract tz_offset_hours to get UT
        dt_utc = dt - datetime.timedelta(hours=float(tz_offset_hours))

    jd_ut = datetime_to_julian(dt_utc)
    return get_ascendant(jd_ut, lat, lon, house_system=house_system)


# Optional quick CLI demo when run as a script
if __name__ == "__main__":
    import pprint
    # Example: 2024-01-01 00:00 local, New Delhi
    sample_dt = datetime.datetime(2024, 1, 1, 0, 0, 0)
    lat_example = 28.6139
    lon_example = 77.2090
    tz_off = 5.5

    try:
        asc = get_ascendant_from_datetime(sample_dt, lat_example, lon_example, tz_off)
        pprint.pprint(asc)
    except Exception as e:
        logger.exception("Demo failed: %s", e)

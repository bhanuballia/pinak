# astronomy/sidereal.py
"""
Sidereal / Ayanamsa helpers built on top of the Swiss Ephemeris (pyswisseph).

Responsibilities:
- Map friendly ayanamsa names (from core.config) to Swiss Ephemeris constants.
- Configure the global sidereal mode used by swisseph (via swe.set_sid_mode).
- Provide helpers to get the numeric ayanamsa for a given Julian Day (in degrees).
- Compute Greenwich Sidereal Time (apparent mean sidereal time) and Local Sidereal Time.

Notes:
- This module does not attempt to re-implement astronomical algorithms;
  it delegates to pyswisseph when available. Where pyswisseph lacks a function
  on some platforms/versions, the code raises a clear RuntimeError explaining
  the missing feature.
- All Julian Day arguments are expected to be UT Julian Days (JD in UT).
"""

from __future__ import annotations

import logging
from typing import Optional

try:
    import swisseph as swe
except Exception:  # pragma: no cover - allow import when pyswisseph isn't installed
    swe = None

from core.config import AYANAMSA
from astronomy.julian import julian_centuries_T

logger = logging.getLogger(__name__)
logger.addHandler(logging.NullHandler())


# Mapping of friendly ayanamsa names to pyswisseph SIDM constants.
# Extend this mapping if you want additional ayanamsa names.
if swe:
    _SID_MODE_MAP = {
        "LAHIRI": getattr(swe, "SIDM_LAHIRI", None),
        "FAGAN_BRADLEY": getattr(swe, "SIDM_FAGAN_BRADLEY", None),
        "RAMAN": getattr(swe, "SIDM_RAMAN", None),
        "KP": getattr(swe, "SIDM_KRISHNAMURTI", None),  # often KRISHNAMURTI
        "KRISHNAMURTI": getattr(swe, "SIDM_KRISHNAMURTI", None),
        # Some swisseph bindings expose different names; keep fallbacks minimal.
    }
else:
    # If swisseph isn't available at import time, provide an empty mapping.
    _SID_MODE_MAP = {}


def _resolve_sid_mode(name: Optional[str]) -> Optional[int]:
    """
    Resolve a string name to a swisseph SIDM_* constant (or None).
    """
    if not name:
        return None
    key = name.strip().upper()
    val = _SID_MODE_MAP.get(key)
    if val is None:
        # Attempt to resolve a couple of common aliases
        if key in ("LAHIRI", "L"):  # explicit check redundant but clearer
            return getattr(swe, "SIDM_LAHIRI", None)
        if key in ("FAGAN", "FAGAN_BRADLEY"):
            return getattr(swe, "SIDM_FAGAN_BRADLEY", None)
    return val


# Public API ---------------------------------------------------------------

def set_ayanamsa(mode: Optional[str] = None) -> Optional[int]:
    """
    Set the global sidereal mode for pyswisseph.

    Parameters
    ----------
    mode : Optional[str]
        Friendly name (e.g., "LAHIRI", "FAGAN_BRADLEY", "RAMAN", "KRISHNAMURTI").
        If None, uses the configured AYANAMSA from core.config.

    Returns
    -------
    int | None
        The numeric swisseph SIDM_* constant that was set, or None if unable.
    """
    resolved_name = (mode or AYANAMSA or "").strip().upper()
    sid_mode = _resolve_sid_mode(resolved_name)

    if sid_mode is None:
        # If mapping not available, log and attempt to set a conservative default (Lahiri)
        fallback = getattr(swe, "SIDM_LAHIRI", None)
        if fallback is not None:
            try:
                swe.set_sid_mode(fallback)
                logger.warning(
                    "Requested ayanamsa '%s' not recognized; defaulting to Lahiri.",
                    resolved_name,
                )
                return fallback
            except Exception as exc:
                logger.exception("Failed to set fallback Lahiri sidemode: %s", exc)
                raise RuntimeError("Unable to set any sidereal mode in swisseph.") from exc
        raise RuntimeError(f"Ayanamsa '{resolved_name}' is not supported by this build.")
    try:
        swe.set_sid_mode(sid_mode)
    except Exception as exc:
        logger.exception("swe.set_sid_mode failed for mode %r: %s", sid_mode, exc)
        raise RuntimeError(f"Failed to set sidereal mode ({resolved_name}).") from exc

    logger.info("Set swisseph sidereal mode to %s (const=%r)", resolved_name, sid_mode)
    return sid_mode


def get_ayanamsa(jd_ut: Optional[float] = None) -> float:
    """
    Return the current ayanamsa (in degrees) for the given Julian Day (UT).

    If jd_ut is None, pyswisseph will use the current date (if supported).
    This function calls swe.get_ayanamsa if available; otherwise it will
    attempt an alternative using swe.get_ayanamsa_ex or raise a clear error.

    Returns
    -------
    float
        Ayanamsa in degrees (usually positive, value depends on sidereal mode).
    """
    # Ensure swisseph sidemode is set according to config (best-effort).
    set_ayanamsa(None)

    # pyswisseph historically exposes different functions across versions:
    # - swe.get_ayanamsa(jd) -> float
    # - swe.get_ayanamsa_ex(jd, flag) -> (ayanamsa, name)
    try:
        if jd_ut is None:
            # Some bindings accept None; try calling without jd first.
            try:
                return float(swe.get_ayanamsa())
            except TypeError:
                # fallback to explicit JD = now
                import datetime as _dt

                now = _dt.datetime.utcnow()
                from astronomy.julian import datetime_to_julian

                jd_now = datetime_to_julian(now)
                return float(swe.get_ayanamsa(jd_now))
        # explicit JD path
        return float(swe.get_ayanamsa(jd_ut))
    except AttributeError:
        # Try alternative API
        try:
            res = swe.get_ayanamsa_ex(jd_ut)
            # get_ayanamsa_ex may return a tuple (ayanamsa, name)
            if isinstance(res, (tuple, list)) and len(res) >= 1:
                return float(res[0])
            return float(res)
        except Exception as exc:
            logger.exception("Failed to obtain ayanamsa from swisseph: %s", exc)
            raise RuntimeError(
                "This pyswisseph build does not expose get_ayanamsa / get_ayanamsa_ex."
            ) from exc
    except Exception as exc:
        logger.exception("get_ayanamsa failed: %s", exc)
        raise


def get_greenwich_sidereal_time(jd_ut: float) -> float:
    """
    Compute the Greenwich Sidereal Time (in degrees) for the given Julian Day (UT).

    Returns
    -------
    float
        GST in degrees (0..360). Use modulo 360 normalization as needed.

    Implementation notes:
    - Prefers pyswisseph's sidereal time function if available (swe.sidtime or swe.sidereal_time).
    - If pyswisseph does not provide a sidereal helper, a fallback approximation is used.
    - The function returns values in degrees (not hours).
    """
    # Primary: use swisseph.swe_sidtime or swe.sidtime if available.
    # Some bindings have swe.sidtime(jd) -> sidereal hours (or degrees).
    try:
        # Many pyswisseph versions provide 'sidtime' which returns sidereal hours.
        if hasattr(swe, "sidtime"):
            val = swe.sidtime(jd_ut)
            # Historically sidtime returns hours; convert hours -> degrees (1h = 15°)
            try:
                # If value seems like hours (0..24), convert to degrees
                return float(val) * 15.0
            except Exception:
                return float(val)
        # Another possible name:
        if hasattr(swe, "sidereal_time"):
            val = swe.sidereal_time(jd_ut)
            return float(val)  # assume degrees
    except Exception as exc:
        logger.debug("swisseph sidereal helper failed: %s", exc)

    # Fallback: approximate GST using Meeus formula
    try:
        # Convert JD to Julian centuries since J2000
        T = julian_centuries_T(jd_ut)
        # Mean sidereal time at Greenwich in degrees (approximation)
        # Formula (approx): 280.46061837 + 360.98564736629 * (jd - J2000)
        # Use a robust form that avoids reliance on a J2000 constant here:
        J2000 = 2451545.0
        gst = 280.46061837 + 360.98564736629 * (jd_ut - J2000) + 0.000387933 * (T ** 2) - (T ** 3) / 38710000.0
        # Normalize to 0..360
        return gst % 360.0
    except Exception as exc:
        logger.exception("Failed to compute fallback GST: %s", exc)
        raise RuntimeError("Unable to compute Greenwich Sidereal Time.") from exc


def get_local_sidereal_time(jd_ut: float, longitude_deg: float) -> float:
    """
    Local Sidereal Time (degrees) at the given geographic longitude.

    Parameters
    ----------
    jd_ut : float
        Julian Day in UT.
    longitude_deg : float
        Geographic longitude (East positive, West negative) in degrees.

    Returns
    -------
    float
        LST in degrees normalized to [0, 360).
    """
    gst_deg = get_greenwich_sidereal_time(jd_ut)
    # Local sidereal time = GST + longitude (east positive)
    lst = (gst_deg + float(longitude_deg)) % 360.0
    return lst

# shadbala/shadbala.py
"""
Compute six-fold Shadbala for natal chart.

Shadbala components:
 - Sthana Bala (Positional)
 - Dig Bala (Directional)
 - Kala Bala (Temporal)
 - Cheshta Bala (Motional)
 - Naisargika Bala (Natural)
 - Drik Bala (Aspectual)

This module implements a pragmatic version suitable for reports: returns per-planet strengths and totals.
"""

from __future__ import annotations
from typing import Dict, Any, Tuple
from math import fabs

from astronomy.positions import get_all_planetary_positions
from core.utils import get_sign_index

# Basic weights (sensible defaults). For production tune per classical tables.
_WEIGHTS = {
    "sth": 1.0,
    "dig": 1.0,
    "kala": 1.0,
    "cheshta": 1.0,
    "naisargika": 1.0,
    "drik": 1.0
}

PLANETS = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"]

def _sth_bala(planet_pos_deg: float) -> float:
    # simple proxy: planets near mid-sign get small bonus; use cosine bell
    pos_in_sign = planet_pos_deg % 30.0
    dist_from_mid = fabs(pos_in_sign - 15.0)
    score = max(0.0, (15.0 - dist_from_mid) / 15.0) * 10.0
    return score

def _dig_bala(planet_name: str, sign_index: int) -> float:
    # directional strength classically: e.g., Kendra houses favor certain planets.
    # We'll implement a simple mapping: if planet in Kendra (1,4,7,10) relative to lagna -> +10
    # But since we don't know lagna here, leave it to caller (they should pass whether in Kendra)
    return 0.0

def _kala_bala(jd_ut: float, planet_name: str) -> float:
    # time-based: Moon stronger during night/day depending on sign. For now return neutral.
    return 2.0

def _cheshta_bala(speed_lon: float) -> float:
    # faster-moving planets get cheshta score; use normalized value
    sp = fabs(speed_lon)
    # typical speeds: Moon ~13 deg/day (0.54 deg/hr), Sun ~1 deg/day, Mercury ~1..2 (var), Mars ~0.5...
    # Normalize to 0..10 scale
    val = min(10.0, sp * 2.0)
    return val

def _naisargika_bala(planet_name: str) -> float:
    # Natural strength ranking (classical): Sun/Jupiter stronger, etc.
    ranking = {"Sun": 5, "Moon": 5, "Jupiter": 5, "Mars": 4, "Venus": 4, "Mercury": 3, "Saturn": 2}
    return float(ranking.get(planet_name, 3))

def _drik_bala(planet_name: str, chart_model: Dict[str, Any]) -> float:
    # Count benefic aspects on planet as a crude proxy
    # For now return constant
    return 2.0

def compute_shadbala(jd_ut: float, lat: float, lon: float, chart_model: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Compute shadbala for each planet.
    chart_model optional already available from build_rashi_chart
    """
    pos = get_all_planetary_positions(jd_ut)
    out = {"planets": {}, "summary": {"strongest": (None, 0.0)}}
    for p in PLANETS:
        info = pos.get(p, {})
        sid = info.get("sidereal", {})
        lon_deg = float(sid.get("lon", 0.0))
        speed = float(sid.get("speed_lon", 0.0))
        sth = _sth_bala(lon_deg)
        dig = _dig_bala(p, int(lon_deg // 30))
        kala = _kala_bala(jd_ut, p)
        ch = _cheshta_bala(speed)
        nais = _naisargika_bala(p)
        drik = _drik_bala(p, chart_model or {})
        total = _WEIGHTS["sth"]*sth + _WEIGHTS["dig"]*dig + _WEIGHTS["kala"]*kala + _WEIGHTS["cheshta"]*ch + _WEIGHTS["naisargika"]*nais + _WEIGHTS["drik"]*drik
        out["planets"][p] = {
            "sth": sth, "dig": dig, "kala": kala, "cheshta": ch, "naisargika": nais, "drik": drik, "total": total
        }
        if total > out["summary"]["strongest"][1]:
            out["summary"]["strongest"] = (p, total)
    return out

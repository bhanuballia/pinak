# strength/shadbala.py
"""
Shadbala module (simplified, extensible).

Shadbala (six-strengths) is a classical Vedic technique measuring planetary strength:
 - Sthana Bala (positional)
 - Dig Bala (directional)
 - Kala Bala (temporal)
 - Cheshta Bala (motion)
 - Naisargika Bala (natural)
 - Drik Bala (aspectual)

This implementation computes reasonable approximations for each component
so you have deterministic numeric outputs that can be improved with reference
tables later.

Returns a per-planet breakdown and a total shadbala score.
"""
from __future__ import annotations
from typing import Dict, Any
import math

from astronomy.positions import get_all_planetary_positions
from charts.houses import compute_houses
from core.utils import get_sign_index, normalize_angle

# basic natural strength (Naisargika) table (normalized 0..10)
NAISARGIKA_BASE = {
    "Sun": 10, "Moon": 10, "Mars": 7, "Mercury": 7, "Jupiter": 9, "Venus": 8, "Saturn": 6, "Rahu": 5, "Ketu": 5
}


def compute_sthana_bala(planet_lon: float, asc_deg: float) -> float:
    """
    Rough Sthana Bala: planets nearer to their exaltation point get higher score.
    Exaltation points (approx): Sun 10° Aries (40), Moon 3° Taurus (33), Mars 28° Capricorn (298),
    Mercury 15° Virgo (165), Jupiter 5° Cancer (125), Venus 27° Pisces (357), Saturn 20° Libra (230)
    We'll compute inverse distance to exaltation as score normalized to 0..10.
    """
    exalt = {
        "Sun": 40.0, "Moon": 33.0, "Mars": 298.0, "Mercury": 165.0,
        "Jupiter": 125.0, "Venus": 357.0 % 360.0, "Saturn": 230.0
    }
    # fallback: reward being near mid-sign (15°) if exaltation unknown
    # But this function expects planet-specific exalt value; caller chooses or fallback
    return 0.0  # computed at caller with access to planet name


def compute_shadbala(jd_ut: float, lat: float, lon: float, house_system: str = "W") -> Dict[str, Any]:
    """
    Compute simplified shadbala for all major planets given JD & place.

    Returns:
    {
      "planets": {
         "Sun": {
             "sthana": float, "dig": float, "kala": float, "cheshta": float,
             "naisargika": float, "drik": float, "total": float
         }, ...
      },
      "total_per_planet": {...},
      "summary": { "max": ("Sun", 42.3), ... }
    }
    """
    planets = get_all_planetary_positions(jd_ut)
    houses = compute_houses(jd_ut, lat, lon, system=house_system)
    asc = houses["ascendant_deg"]

    result: Dict[str, Any] = {"planets": {}}
    for name, pdata in planets.items():
        sid_lon = pdata["sidereal"]["lon"]
        # Naisargika (natural) base
        nais = NAISARGIKA_BASE.get(name, 5)
        # Cheshta: based on speed (approx) -> faster planets considered more active
        spd = pdata["sidereal"].get("speed_lon") if pdata["sidereal"] else 0.0
        cheshta = min(10.0, abs(spd) * 2.0) if spd is not None else 1.0

        # Dig Bala: planets in certain houses (1,4,7,10) for ascendant get direction strength
        # Simplified: if planet in kendra (1,4,7,10) -> dig=10 else 5
        from charts.houses import get_house_number
        house_no = get_house_number(sid_lon, houses["cusps"])
        dig = 10.0 if house_no in (1,4,7,10) else 5.0

        # Kala Bala: reward by weekday and planet ownership (simplistic)
        # mapping weekday owner approximations (Sun->Sun day etc.)
        import datetime
        dt = None
        try:
            # rough: convert JD to datetime using astronomy.julian if available
            from astronomy.julian import julian_to_datetime
            dt = julian_to_datetime(jd_ut)
        except Exception:
            dt = None
        if dt:
            weekday = dt.weekday()  # 0=Mon ... 6=Sun
            weekday_owner = {
                6: "Sun", 0: "Moon", 1: "Mars", 2: "Mercury", 3: "Jupiter", 4: "Venus", 5: "Saturn"
            }
            kala = 10.0 if weekday_owner.get(weekday) == name else 6.0
        else:
            kala = 6.0

        # Drik (aspectual) strength: count benefic aspects on planet (simplified)
        # For now, simplistic: if Jupiter or Moon aspect list includes planet -> drik high
        drik = 5.0
        # Sthana Bala: proximity to exaltation (approx)
        exalt_points = _approx_exaltation_proximity(name, sid_lon)

        total = nais + cheshta + dig + kala + drik + exalt_points

        result["planets"][name] = {
            "sthana": float(exalt_points),
            "dig": float(dig),
            "kala": float(kala),
            "cheshta": float(cheshta),
            "naisargika": float(nais),
            "drik": float(drik),
            "total": float(total),
            "house": int(house_no),
            "sidereal_lon": float(sid_lon)
        }

    # summary
    totals = {p: data["total"] for p,data in result["planets"].items()}
    max_planet = max(totals.items(), key=lambda t: t[1])[0]
    result["summary"] = {"strongest": (max_planet, totals[max_planet])}
    return result


def _approx_exaltation_proximity(planet: str, lon: float) -> float:
    """
    Simple numerical approximation for Sthana Bala: distance from exaltation point.
    Returns 0..10 where closer to exaltation increases the score.
    """
    exalt_map = {
        "Sun": 10.0, "Moon": 33.0, "Mars": 28.0 + 270.0,  # Mars exalt in Capricorn ~ 28° (cap) = 298
        "Mercury": 165.0, "Jupiter": 125.0, "Venus": 357.0 % 360.0, "Saturn": 230.0
    }
    # Normalize and compute
    ex = exalt_map.get(planet)
    if ex is None:
        return 4.0  # neutral
    ex = ex % 360.0
    d = abs(((lon - ex + 180.0) % 360.0) - 180.0)
    # map 0..180 -> score 10..0
    score = max(0.0, 10.0 * (1.0 - d/180.0))
    return float(score)

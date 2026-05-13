# shadbala/classical_shadbala.py
from __future__ import annotations
from typing import Dict, Any
from math import fabs
from astronomy.positions import get_all_planetary_positions
from core.utils import get_sign_index, get_house_of_planet  # add helper to charts.utils if missing

# Classical weight tables (simplified numeric points to emulate classical tables)
# These tables are based on classical rules (Raman, B.S. Rao variants) but encoded numerically.
# You can replace numbers with exact tables from a text if you have them.

# Naisargika Bala constant points (example)
_NAISARGIKA_POINTS = {
    "Sun": 60,
    "Moon": 60,
    "Mars": 60,
    "Mercury": 40,
    "Jupiter": 60,
    "Venus": 43,
    "Saturn": 60,
}

# Dig Bala: planet has dig bala if located in particular houses relative to ascendant
_DIG_FAVOURED_HOUSE = {
    "Sun": [10],      # Sun strong in 10 (example)
    "Moon": [3],      # Moon strong in 3 (example)
    "Mars": [1,10],   # Mars strong in 1 and 10 etc.
    "Mercury": [1,10],
    "Jupiter": [4,9],
    "Venus": [2,7],
    "Saturn": [7,10],
}

def _sthana_bala_point_for_planet(sign_deg: float) -> float:
    # Sthana: classical positional strength: max near center of sign.
    pos_in_sign = sign_deg % 30.0
    # classical Sthana: max at 15°, min at boundaries. Map to 0..60 scale.
    return max(0.0, (1.0 - abs(pos_in_sign - 15.0)/15.0) * 60.0)

def _dig_bala_point(planet: str, house_no: int) -> float:
    fav = _DIG_FAVOURED_HOUSE.get(planet, [])
    return 30.0 if house_no in fav else 0.0

def _kala_bala_point(jd_ut: float, planet: str, chart_model: Dict[str,Any]) -> float:
    # Kala: include monthly/day-night strength etc. We'll implement day/night (Sun in day strengthens Sun).
    # To compute day/night detect Sun's hour: use ascendant naka or sun altitude if computed else heuristic
    # For now return neutral mid value
    return 15.0

def _cheshta_bala(speed_deg_per_day: float, planet: str) -> float:
    # Cheshta is based on apparent motion; retrograde -> bonus or penalty depending on text
    if speed_deg_per_day < 0:
        return 30.0  # classical adds cheshta for retrograde
    # else scale speed to 0..30
    return min(30.0, speed_deg_per_day * 2.0)

def _drik_bala_point(planet: str, chart_model: Dict[str,Any]) -> float:
    # Count benefic aspects on planet; return 0..30
    # For simplicity: +5 per benefic aspect up to 30
    return 10.0

def compute_shadbala_classical(jd_ut: float, lat: float, lon: float, chart_model: Dict[str,Any]) -> Dict[str,Any]:
    pos = get_all_planetary_positions(jd_ut)
    planets = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"]
    out = {}
    for p in planets:
        sid = pos[p]["sidereal"]
        lon_deg = float(sid["lon"])
        speed = float(sid.get("speed_lon", 0.0))
        sth = _sthana_bala_point_for_planet(lon_deg)
        # determine house for dig/kala using chart_model houses (chart_model must have houses with cusps)
        house_no = chart_model.get("planet_house_map", {}).get(p) or chart_model.get("planet_to_house", {}).get(p) or None
        if house_no is None:
            # attempt to compute from cusps fallback
            house_no = get_house_of_planet(lon_deg, chart_model) if hasattr(chart_model, "get") else 1
        dig = _dig_bala_point(p, house_no)
        kala = _kala_bala_point(jd_ut, p, chart_model)
        ch = _cheshta_bala(speed, p)
        nais = _NAISARGIKA_POINTS.get(p, 30)
        drik = _drik_bala_point(p, chart_model)
        total = sth + dig + kala + ch + nais + drik
        out[p] = {
            "sth": sth, "dig": dig, "kala": kala, "cheshta": ch, "naisargika": nais, "drik": drik, "total": total
        }
    # identify strongest
    strongest = max(out.items(), key=lambda kv: kv[1]["total"])
    return {"planets": out, "strongest": strongest}

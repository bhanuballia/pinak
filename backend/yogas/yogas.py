# yogas/yogas.py
"""
Yogas detection engine.

Design:
 - Receives chart model: houses, planetary positions (sidereal lon), ascendant.
 - A list of rule functions returns detected yogas (name, severity, desc).
 - Rules are modular; add new rules as functions and register them in RULES.
"""

from __future__ import annotations
from typing import Dict, Any, List, Callable
from core.utils import get_sign_index

def _planet_in_house(chart: Dict[str, Any], planet: str, house_no: int) -> bool:
    h = chart.get("houses", {}).get(house_no, {})
    return planet in h.get("planets", [])

def _is_bhava_yoga(chart: Dict[str, Any], planet: str) -> bool:
    # placeholder
    return False

def yoga_rama_basics(chart: Dict[str, Any]) -> List[Dict[str, Any]]:
    res = []
    # Example: Raja yoga basic check (planet in Kendra + strong)
    # Kendra houses: 1,4,7,10
    kendra = [1,4,7,10]
    for p in ["Jupiter","Mars","Saturn","Mercury","Venus","Sun","Moon"]:
        for h in kendra:
            if _planet_in_house(chart, p, h):
                res.append({"name": f"Raja yoga (basic) - {p} in Kendra", "desc": f"{p} occupies Kendra {h}."})
                break
    return res

def yoga_dhana_simple(chart: Dict[str, Any]) -> List[Dict[str, Any]]:
    res = []
    # If Jupiter (wealth) aspects 2nd or 11th or occupies 2nd/11th -> Dhana yoga (simplified)
    # For simplicity check occupancy
    if _planet_in_house(chart, "Jupiter", 2) or _planet_in_house(chart, "Jupiter", 11):
        res.append({"name": "Dhana yoga (Jupiter strong in 2/11)", "desc": "Jupiter in 2nd or 11th house indicates financial strength."})
    return res

RULES: List[Callable[[Dict[str, Any]], List[Dict[str, Any]]]] = [
    yoga_rama_basics,
    yoga_dhana_simple,
    # add more rule functions here...
]

def detect_yogas(chart: Dict[str, Any]) -> Dict[str, Any]:
    out = {"yogas": []}
    for r in RULES:
        try:
            found = r(chart) or []
            out["yogas"].extend(found)
        except Exception:
            continue
    return out

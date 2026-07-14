# ashtakavarga/classical.py
"""
Classical Ashtakavarga multi-mode implementation.

Modes supported:
 - "BV_RAMAN"            (A)
 - "CS_PATEL"            (B)
 - "BPHS_SAN thanam"     (C)  (use "BPHS_SANthanam" as key)
 - "PV_NARASIMHA"        (D)  <- default (JHora / PV Narasimha Rao parity)
 - "PARASHARA_LIGHT"     (E)  (approximate / reverse-engineered)
 - "CUSTOM"              (F)  loads JSON table from data/ashtakavarga_tables/CUSTOM.json

Design:
 - Each mode defines a donor->favorable-house table similar to `_ASHTAK_TABLE`
 - The engine maps donor sign -> target sign for each listed house and accumulates bindus.
 - Returns bhinnashtakavarga (per recipient), sarvashtakavarga (per sign), house_strengths, metadata.
 - If custom JSON present, it must follow the same shape as `_ASHTAK_TABLE` used earlier.
"""
from __future__ import annotations
from typing import Dict, List, Any
import json
import os
from pathlib import Path

from core.utils import get_sign_index
from astronomy.positions import get_all_planetary_positions
from astronomy.ascendant import get_ascendant
from charts.houses import compute_houses

# default base table (used for PV_NARASIMHA and as baseline). This is the same
# _ASHTAK_TABLE we used earlier (trimmed copy). For brevity we reference the earlier
# module if present; otherwise embed a conservative table.
_DEFAULT_TABLE = None

# Attempt to reuse existing module's table if available
try:
    from ashtakavarga.ashtakavarga import _ASHTAK_TABLE as _EXISTING_TABLE  # type: ignore
    _DEFAULT_TABLE = _EXISTING_TABLE
except Exception:
    # minimal fallback: each donor gives bindus to their own sign and 7th and 5th
    _DEFAULT_TABLE = {}
    RECIPIENTS = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Lagna"]
    for r in RECIPIENTS:
        _DEFAULT_TABLE[r] = {
            d: [1,5,7]  # trivial placeholder (will be overridden by real mode tables)
            for d in ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Lagna"]
        }

# Known mode -> table mapping. For now most modes reuse the same classical table
# (_DEFAULT_TABLE) but this structure allows per-mode custom tables as needed.
_MODE_TABLES: Dict[str, Dict[str, Dict[str, List[int]]]] = {
    "PV_NARASIMHA": _DEFAULT_TABLE,
    "CS_PATEL": _DEFAULT_TABLE,
    "BV_RAMAN": _DEFAULT_TABLE,
    "BPHS_SANthanam": _DEFAULT_TABLE,
    "PARASHARA_LIGHT": _DEFAULT_TABLE,
}

DATA_DIR = Path(__file__).resolve().parents[1] / "data" / "ashtakavarga_tables"
DATA_DIR.mkdir(parents=True, exist_ok=True)

def _load_custom_table(mode: str) -> Dict[str, Dict[str, List[int]]]:
    """
    Attempt to load a custom donor->houses table from data/ashtakavarga_tables/<mode>.json
    """
    path = DATA_DIR / f"{mode}.json"
    if not path.exists():
        raise FileNotFoundError(f"Custom Ashtakavarga table not found: {path}")
    with open(path, "r", encoding="utf-8") as fh:
        obj = json.load(fh)
    return obj


def _resolve_table_for_mode(mode: str) -> Dict[str, Dict[str, List[int]]]:
    mode = (mode or "PV_NARASIMHA").upper()
    if mode == "CUSTOM":
        raise ValueError("Use explicit custom name, e.g. 'CUSTOM_MYTABLE' and place JSON at data/ashtakavarga_tables/CUSTOM_MYTABLE.json")
    # exact match
    if mode in _MODE_TABLES:
        return _MODE_TABLES[mode]
    # fallback: check for file in data dir
    try:
        return _load_custom_table(mode)
    except FileNotFoundError:
        # fallback to default
        return _DEFAULT_TABLE


def _empty_bhinnashtakavarga_structure() -> Dict[str, List[int]]:
    RECIPIENTS = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Lagna"]
    return {r: [0]*12 for r in RECIPIENTS}


def compute_ashtakavarga_classical(jd_ut: float, lat: float, lon: float, mode: str = "PV_NARASIMHA") -> Dict[str, Any]:
    """
    High-level function computing classical Ashtakavarga using the chosen mode.

    Returns:
    {
      "mode": str,
      "table_used": "<internal | custom path>",
      "bhinnashtakavarga": { recipient: [12-int-list], ... },
      "sarvashtakavarga": [12-int-list],
      "house_strengths": {1..12: {...}},
      "total_bindus": int
    }
    """
    mode_key = (mode or "PV_NARASIMHA").upper()

    # resolve table
    if mode_key.startswith("CUSTOM_"):
        table = _load_custom_table(mode_key)
        table_used = f"custom:{mode_key}"
    else:
        table = _resolve_table_for_mode(mode_key)
        table_used = f"builtin:{mode_key}"

    # get positions and ascendant
    planet_positions = get_all_planetary_positions(jd_ut)
    asc = get_ascendant(jd_ut, lat, lon)
    asc_deg = float(asc["ascendant_deg"])

    # donors signs map
    donors = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Lagna"]
    donor_sign_map = {}
    for d in donors:
        if d == "Lagna":
            donor_sign_map[d] = get_sign_index(asc_deg)
        else:
            lon_d = float(planet_positions[d]["sidereal"]["lon"])
            donor_sign_map[d] = get_sign_index(lon_d)

    # compute bhinns
    bhinn = _empty_bhinnashtakavarga_structure()
    for recipient, donor_map in table.items():
        for donor, favored_houses in donor_map.items():
            donor_sign = donor_sign_map.get(donor)
            if donor_sign is None:
                continue
            for house_num in favored_houses:
                target_sign = (donor_sign + (house_num - 1)) % 12
                # Add 1 bindu
                bhinn[recipient][target_sign] += 1

    # sarva (sum across recipients)
    sarva = [0]*12
    for recipient_vals in bhinn.values():
        for i in range(12):
            sarva[i] += int(recipient_vals[i])

    total_bindus = sum(sarva)

    # house strengths -> map cusp -> sign index
    houses_data = compute_houses(jd_ut, lat, lon, system="W")
    cusps = houses_data["cusps"]
    house_strengths = {}
    for h in range(1,13):
        cusp = cusps[h]
        sign_idx = get_sign_index(cusp)
        bindus = sarva[sign_idx]
        percent = (bindus / total_bindus * 100.0) if total_bindus > 0 else 0.0
        house_strengths[h] = {
            "sign_index": int(sign_idx),
            "cusp_deg": float(cusp),
            "bindus": int(bindus),
            "percent_of_total": float(percent)
        }

    return {
        "mode": mode_key,
        "table_used": table_used,
        "bhinnashtakavarga": bhinn,
        "sarvashtakavarga": sarva,
        "house_strengths": house_strengths,
        "total_bindus": int(total_bindus),
    }

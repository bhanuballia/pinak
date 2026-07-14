"""
charts/divisional/varga_utils.py
==================================
Utility functions shared across all Varga chart calculators.
"""
from __future__ import annotations


def calculate_house(asc_sign: int, planet_sign: int) -> int:
    """
    Calculate whole-sign house number (1–12) for a planet given
    the Ascendant sign and the planet's sign.

    Parameters
    ----------
    asc_sign    : 0-based sign index of the Ascendant (0=Aries … 11=Pisces)
    planet_sign : 0-based sign index of the planet

    Returns
    -------
    House number 1–12
    """
    return ((planet_sign - asc_sign) % 12) + 1


def get_sign_name(sign_index: int) -> str:
    """
    Return the zodiac sign name for a 0-based sign index.

    Parameters
    ----------
    sign_index : 0–11

    Returns
    -------
    Sign name string (e.g. "Aries")
    """
    from charts.divisional.base_varga import SIGNS
    return SIGNS[sign_index % 12]


def planets_in_houses(
    planet_sign_map: dict,
    asc_sign: int,
) -> dict:
    """
    Build a house → [planet] mapping using whole-sign house system.

    Parameters
    ----------
    planet_sign_map : {planet_name: sign_index, ...}
    asc_sign        : 0-based ascendant sign index

    Returns
    -------
    dict {house_number (1–12): [planet_names]}
    """
    result: dict = {h: [] for h in range(1, 13)}
    for planet, sign_idx in planet_sign_map.items():
        house = calculate_house(asc_sign, sign_idx)
        result[house].append(planet)
    return result


def vargottama_check(d1_sign: int, d9_sign: int) -> bool:
    """
    Return True if the planet occupies the same sign in D1 and D9
    (Vargottama – highly auspicious placement).
    """
    return d1_sign == d9_sign

# core/analysis/dosha_engine.py
"""
Vedic Dosha Engine - Analyzes Manglik, Kalsarpa, Pitra, and SadeSati doshas.
Provides calculated results with technical details for reports.
"""

from .utils import get_planet_house

MALEFICS = ["Mars", "Saturn", "Rahu", "Ketu"]


def calculate_manglik(chart):
    """
    Analyzes Manglik Dosha (Kuja Dosha).
    Mars in houses [1, 2, 4, 7, 8, 12] relative to Lagna creates this dosha.
    """
    mars_house = get_planet_house(chart, "Mars")
    
    # classical + south indian inclusion of 2nd house
    manglik_houses = [1, 2, 4, 7, 8, 12]
    is_manglik = mars_house in manglik_houses

    return {
        "present": is_manglik,
        "house": mars_house,
        "summary": "Manglik influence from Mars in house {}.".format(mars_house) if is_manglik else "No Manglik Dosha detected.",
        "details": [
            "Mars in houses 1, 2, 4, 7, 8, or 12 creates Manglik Dosha.",
            "Hanuman Chalisa and Tuesday fasts are recommended for Mars stability." if is_manglik else "Mars is favorably placed."
        ]
    }


def calculate_kalsarp(chart):
    """
    Analyzes Kalsarpa Dosha.
    Occurs when all planets are hemmed between Rahu and Ketu.
    """
    rahu_house = get_planet_house(chart, "Rahu")
    ketu_house = get_planet_house(chart, "Ketu")

    if rahu_house is None or ketu_house is None:
        return {"present": False, "summary": "Nodes missing for calculation."}

    # Extract all planetary house positions
    planets_to_check = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
    planet_houses = []
    for p in planets_to_check:
        h = get_planet_house(chart, p)
        if h is not None:
            planet_houses.append(h)

    # Check if all planets are between Rahu and Ketu
    # Case 1: Rahu < Ketu (e.g., 2 and 8)
    if rahu_house < ketu_house:
        present = all(rahu_house <= h <= ketu_house for h in planet_houses)
        # Also check the other direction (Ketu to Rahu via 12-1 loop)
        present_alt = all(h >= ketu_house or h <= rahu_house for h in planet_houses)
    else:
        # Case 2: Rahu > Ketu (e.g., 10 and 4)
        present = all(ketu_house <= h <= rahu_house for h in planet_houses)
        present_alt = all(h >= rahu_house or h <= ketu_house for h in planet_houses)

    is_kalsarpa = present or present_alt

    return {
        "present": is_kalsarpa,
        "rahu_house": rahu_house,
        "ketu_house": ketu_house,
        "summary": "Kalsarpa Dosha active - planets hemmed between nodes." if is_kalsarpa else "No Kalsarpa Dosha detected.",
        "details": [
            "Planets are bounded by Rahu and Ketu." if is_kalsarpa else "Planets are distributed across the chart.",
            "Remedies: Maha Mrityunjaya mantra and Rahu-Ketu shanti." if is_kalsarpa else "Soul energy flows freely."
        ]
    }


def calculate_pitra_dosha(chart):
    """
    Analyzes Pitra Dosha (Ancestral Curse/Debt).
    Commonly seen when Sun (Pitra karaka) is with Rahu/Ketu or in 9th house with malefics.
    """
    sun_house = get_planet_house(chart, "Sun")
    rahu_house = get_planet_house(chart, "Rahu")
    ketu_house = get_planet_house(chart, "Ketu")
    saturn_house = get_planet_house(chart, "Saturn")

    # simplified common indicators
    indicator_1 = sun_house in [rahu_house, ketu_house]
    indicator_2 = sun_house == 9 and saturn_house == 9
    
    is_pitra = indicator_1 or indicator_2

    return {
        "present": is_pitra,
        "summary": "Pitra Dosha detected - ancestral karma influence." if is_pitra else "Pitra Dosha not observed.",
        "details": [
            "Sun is afflicted by shadow planets." if indicator_1 else "Sun is well placed.",
            "Ancestral blessings are strong." if not is_pitra else "Performance of Tarpan and charity is recommended."
        ]
    }


def calculate_sadesati(chart):
    """
    Analyzes Sade Sati (Saturn's 7.5 year transit over the Moon).
    Occurs when Saturn is in the house before, Same house, or house after the natal Moon.
    """
    saturn_house = get_planet_house(chart, "Saturn")
    moon_house = get_planet_house(chart, "Moon")

    if saturn_house is None or moon_house is None:
        return {"present": False, "summary": "Saturn or Moon missing."}

    # Difference in houses
    diff = (saturn_house - moon_house) % 12
    # Houses: 12 (before), 0 (same), 1 (after)
    is_sadesati = diff in [11, 0, 1]

    phase = "none"
    if diff == 11: phase = "Rising (First)"
    elif diff == 0: phase = "Peak (Second)"
    elif diff == 1: phase = "Setting (Third)"

    # Calculate detailed life cycles for PDF/UI
    all_cycles = []
    try:
        from astrology.sade_sati import calculate_all_life_cycles
        from astronomy.julian import julian_to_datetime
        birth_dt = julian_to_datetime(chart.get("jd_ut", 0))
        # Get Moon sign index (0-11)
        moon_lon = chart.get("planet_positions", {}).get("Moon", {}).get("sidereal", {}).get("lon", 0)
        moon_sign_idx = int(moon_lon // 30) % 12
        all_cycles = calculate_all_life_cycles(moon_sign_idx, birth_dt.year)
    except Exception as e:
        print(f"Error calculating Sade Sati cycles: {e}")

    return {
        "present": is_sadesati,
        "phase": phase,
        "summary": "Sade Sati ({}) active.".format(phase) if is_sadesati else "Sade Sati not currently active.",
        "all_cycles": all_cycles,
        "details": [
            "Saturn is transiting close to natal Moon." if is_sadesati else "Saturn is in a safe distance from Moon.",
            "Stay disciplined; practice patience and charity." if is_sadesati else "Emotional cycles are stable."
        ]
    }


def calculate_rahu_dosha(chart):
    """
    Analyzes Rahu Dosha.
    Rahu in 1st, 2nd, 7th, or 8th house can cause life disturbances.
    """
    rahu_house = get_planet_house(chart, "Rahu")
    is_rahu_dosha = rahu_house in [1, 2, 7, 8]
    
    return {
        "present": is_rahu_dosha,
        "house": rahu_house,
        "summary": "Rahu Dosha present - Rahu in house {}.".format(rahu_house) if is_rahu_dosha else "No significant Rahu Dosha found.",
        "details": [
            "Rahu in 1st, 2nd, 7th, or 8th house impacts health or relationships." if is_rahu_dosha else "Rahu is in a non-afflicting house.",
            "Worship Goddess Durga and chant Rahu Beej Mantra." if is_rahu_dosha else "Shadow cycles are balanced."
        ]
    }


def calculate_ketu_dosha(chart):
    """
    Analyzes Ketu Dosha.
    Ketu in 1st, 2nd, 7th, or 8th house can lead to spiritual or material confusion.
    """
    ketu_house = get_planet_house(chart, "Ketu")
    is_ketu_dosha = ketu_house in [1, 2, 7, 8]
    
    return {
        "present": is_ketu_dosha,
        "house": ketu_house,
        "summary": "Ketu Dosha present - Ketu in house {}.".format(ketu_house) if is_ketu_dosha else "No significant Ketu Dosha found.",
        "details": [
            "Ketu in sensitive houses can cause isolation or confusion." if is_ketu_dosha else "Ketu is well placed for detachment.",
            "Worship Lord Ganesha and offer grass (durva) to resolve Ketu issues." if is_ketu_dosha else "Planetary focus is clear."
        ]
    }


def calculate_all_doshas(chart):
    """
    Main entry point for dosha engine.
    """
    return {
        "manglik": {**calculate_manglik(chart), "dosha": "Manglik", "severity": "moderate"},
        "kalsarp": {**calculate_kalsarp(chart), "dosha": "Kalsarpa", "severity": "high"},
        "pitra": {**calculate_pitra_dosha(chart), "dosha": "Pitra", "severity": "moderate"},
        "sadesati": {**calculate_sadesati(chart), "dosha": "SadeSati", "severity": "moderate"},
        "rahu": {**calculate_rahu_dosha(chart), "dosha": "Rahu", "severity": "moderate"},
        "ketu": {**calculate_ketu_dosha(chart), "dosha": "Ketu", "severity": "moderate"},
    }

# core/transits/transit_engine.py
"""
Vedic Transit Engine - Processes real-time planetary movements against the natal chart.
Detects significant triggers for career, health, relationships, and wealth.
Includes year-based predictive forecasts.
"""

from .transit_calculator import compute_transits
from .transit_rules import (
    jupiter_career_trigger,
    saturn_pressure,
    venus_relationship_window,
    rahu_life_shift,
)
from .transit_events import build_transit_event

def saturn_transit_effect(year, natal_chart):
    """
    User-requested logic: Logic to determine Saturn's effect for a specific year.
    Note: Real calculations are prioritized, but this provides the requested year-based hook.
    """
    # Mapping year to a cyclic house progression (simplified Vedic progression)
    # Roughly represents Saturn's slow movement through the zodiac over ~30 years,
    # but here mapped to a 12-house cycle for the user's specific logic.
    saturn_house = (year % 12) + 1

    # Check natal moon house
    moon_house = 1
    for h_num, h_data in natal_chart.get("houses", {}).items():
        planets_in_house = [p["name"] if isinstance(p, dict) else p for p in h_data.get("planets", [])]
        if "Moon" in planets_in_house:
            moon_house = int(h_num)
            break

    if saturn_house == moon_house:
        return "Saturn transit over natal Moon brings a period of emotional maturity and structural life changes."
    
    return ""

def detect_transit_events(report_data):
    """
    Main entry point for transit analysis in the report pipeline.
    """
    jd_ut = report_data.get("jd_ut")
    chart = report_data.get("chart")

    if not jd_ut or not chart:
        return report_data

    # 1. Compute REAL-TIME transits (using Swiss Ephemeris JD)
    transits = compute_transits(jd_ut, chart)
    report_data["transits"] = transits 

    events = []

    # 2. Apply Rule-based Triggers
    if jupiter_career_trigger(transits):
        events.append(build_transit_event("jupiter_expansion", "career"))

    if saturn_pressure(transits):
        events.append(build_transit_event("saturn_discipline", "life"))

    if venus_relationship_window(transits):
        events.append(build_transit_event("venus_harmony", "love"))

    if rahu_life_shift(transits):
        events.append(build_transit_event("rahu_transformation", "destiny"))

    # 3. Generate Year-based Forecast (requested hook)
    current_year = 2025 # Default current
    try:
        from astronomy.julian import julian_to_datetime
        current_year = julian_to_datetime(jd_ut).year + 25 # Looking 25 years ahead as example
    except:
        pass
        
    saturn_msg = saturn_transit_effect(current_year, chart)
    if saturn_msg:
        events.append({
            "type": "transit",
            "event": "major_saturn_cycle",
            "category": "personal",
            "summary": saturn_msg
        })

    report_data["transit_events"] = events
    
    # Store transits in a structured way for the PDF
    report_data["transit_analysis"] = {
        "current_positions": transits,
        "active_events": events,
        "summary": "Real-time transit triggers detected for {} cycle.".format(current_year)
    }

    return report_data

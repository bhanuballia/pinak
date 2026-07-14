# core/predictions/event_detector.py
"""
Life Event Detection Engine - Identifies periods of career, relationship, and personal growth.
Analyzes the natal chart data alongside planetary dashas and transits.
"""

from core.analysis.utils import get_planet_house, get_sign_of_planet
from .utils import get_dasha_lord_for_year

def detect_events(chart, dasha):
    """
    Analyzes the astrological data to predict significant life events over a 10-year period (2025–2035).
    Converts chart placements and dasha cycles into tangible life events.
    """
    events = []
    
    # 1. Career Event Detection (Karmic & Professional Rise)
    # Jupiter in 10th (Career) or 1st (Self/Success)
    jupyter_house = get_planet_house(chart, "Jupiter")
    if jupyter_house == 10:
        events.append({
            "year": 2027,
            "category": "Career",
            "title": "Major Career Expansion",
            "intensity": 9.2,
            "summary": "Jupiter transiting the 10th house brings massive professional recognition and leadership opportunities."
        })
    elif jupyter_house == 1:
        events.append({
            "year": 2026,
            "category": "Career",
            "title": "New Venture & Confidence",
            "intensity": 8.5,
            "summary": "Expansion of self-identity leads to successful new professional beginnings."
        })

    # 2. Relationship & Social Event Detection
    # Venus in 7th (Marriage/Partnership) or 5th (Romance/Creativity)
    venus_house = get_planet_house(chart, "Venus")
    if venus_house == 7:
        events.append({
            "year": 2028,
            "category": "Relationship",
            "title": "Golden Marriage Window",
            "intensity": 9.5,
            "summary": "Venus in the house of partnerships creates a powerful alignment for long-term commitment."
        })
    elif venus_house == 5:
        events.append({
            "year": 2026,
            "category": "Relationship",
            "title": "Romantic Fulfillment",
            "intensity": 7.8,
            "summary": "Period of creative joy and emotional deepening in personal bonds."
        })

    # 3. Financial & Wealth Event Detection
    # Mars or Mercury in 2nd (Wealth) or 11th (Gains)
    mercury_house = get_planet_house(chart, "Mercury")
    if mercury_house in [2, 11]:
        events.append({
            "year": 2029,
            "category": "Finance",
            "title": "Significant Wealth Inflow",
            "intensity": 8.0,
            "summary": "Strategic investments and communication leads to substantial financial gains."
        })

    # 4. Dasha-driven Events (2025-2035)
    # We scan the decade for major dasha lord shifts or favorable periods
    detected_years = set(e["year"] for e in events)
    
    for year in range(2025, 2036):
        if year in detected_years:
            continue
            
        lord = get_dasha_lord_for_year(year, dasha)
        
        # Favorable Lords
        if lord in ["Jupiter", "Venus", "Mercury"]:
            events.append({
                "year": year,
                "category": "General",
                "title": "Benefic {} Phase".format(lord),
                "intensity": 7.5,
                "summary": "A supportive period for growth, learning, and overall well-being."
            })
            detected_years.add(year)
            
        # Structural Lords
        elif lord == "Saturn":
            events.append({
                "year": year,
                "category": "Foundation",
                "title": "Saturnian Structural Build",
                "intensity": 6.8,
                "summary": "A period of hard work and discipline that lays the foundation for future security."
            })
            detected_years.add(year)

    # Sort by year for chronological report flow
    events.sort(key=lambda x: x["year"])
    
    return events

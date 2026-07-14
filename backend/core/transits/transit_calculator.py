# core/transits/transit_calculator.py
"""
Calculates current planetary positions (transits) relative to a natal chart.
Uses Swiss Ephemeris for high-precision real-time positioning.
"""

import datetime
from astronomy.julian import datetime_to_julian
from astronomy.positions import get_all_planetary_positions
from charts.houses import get_house_number

def compute_transits(jd_ut, chart, transit_jd=None):
    """
    Computes transiting planet positions and their house placement
    relative to the natal chart's house cusps.
    
    Args:
        jd_ut: Natal Julian Day (for context, unused here but kept for API)
        chart: Natal chart model (containing 'houses' and 'cusps')
        transit_jd: Optional specific Julian Day to calculate transits for.
                    If None, uses current system time (UTC).
                    
    Returns:
        Dict mapping planet name to its transit data:
        {
            "Jupiter": {"house": 10, "lon": 285.4},
            ...
        }
    """
    if transit_jd is None:
        now = datetime.datetime.utcnow()
        transit_jd = datetime_to_julian(now)

    # 1. Get real-time positions for all planets
    transit_positions = get_all_planetary_positions(transit_jd)
    
    # 2. Map them to natal houses
    # We need the natal house cusps to determine where transiting planets fall
    cusps = []
    # Houses are 1-indexed in our models
    for h in range(1, 13):
        h_data = chart.get("houses", {}).get(h) or chart.get("houses", {}).get(str(h), {})
        cusps.append(h_data.get("cusp_deg"))
    
    # Insert a dummy 0 index if get_house_number expects 1-based indexing internally or 0-offset
    # Based on charts/rashi_chart.py: cusps = houses_data["cusps"] (1-based from compute_houses)
    # Let's ensure cusps is a list where cusps[1] is 1st house
    full_cusps = [None] + cusps if len(cusps) == 12 else cusps

    results = {}
    for planet, pos_data in transit_positions.items():
        lon = pos_data["sidereal"]["lon"]
        house = get_house_number(lon, full_cusps)
        
        results[planet] = {
            "house": house,
            "lon": round(lon, 2),
            "speed": pos_data["sidereal"].get("speed_lon", 0)
        }
        
    return results

import datetime
from astronomy.julian import datetime_to_julian
from astronomy.positions import get_all_planetary_positions
from core.utils import get_house_from_lagna

def saturn_pressure(year, chart):
    """Calculates Saturn's transit pressure relative to natal lagna for a given year."""
    lagna_deg = chart.get("ascendant_deg", 0)
    
    # 1. Use Transit Position if year is provided
    if year:
        dt = datetime.datetime(year, 7, 1) # Mid-year average
        jd = datetime_to_julian(dt)
        positions = get_all_planetary_positions(jd)
        saturn_lon = positions.get("Saturn", {}).get("sidereal", {}).get("lon", 0)
        house = get_house_from_lagna(lagna_deg, saturn_lon)
    else:
        # Fallback: Find in natal chart structure
        house = 0
        houses = chart.get("houses", {})
        for h_num, info in houses.items():
            if "Saturn" in info.get("planets", []):
                house = int(h_num)
                break

    # Traditional "negative" transits: 8th and 12th houses relative to lagna
    if house in [8, 12]:
        return -0.2
    # Neutral/Positive for others in this simplified model
    return 0.1

def jupiter_support(year, chart):
    """Calculates Jupiter's transit support relative to natal lagna for a given year."""
    lagna_deg = chart.get("ascendant_deg", 0)
    
    if year:
        dt = datetime.datetime(year, 7, 1)
        jd = datetime_to_julian(dt)
        positions = get_all_planetary_positions(jd)
        jupiter_lon = positions.get("Jupiter", {}).get("sidereal", {}).get("lon", 0)
        house = get_house_from_lagna(lagna_deg, jupiter_lon)
    else:
        # Fallback: Find in natal chart structure
        house = 0
        houses = chart.get("houses", {})
        for h_num, info in houses.items():
            if "Jupiter" in info.get("planets", []):
                house = int(h_num)
                break

    # Traditional "positive" transits: 1st, 5th, 9th houses (Trikona/Kendra)
    if house in [1, 5, 9]:
        return 0.3
    return 0.05

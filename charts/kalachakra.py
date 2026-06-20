# charts/kalachakra.py
from core.utils import ZODIAC_SIGNS, get_sign_index
from panchang.nakshatra import NAKSHATRAS

# The 28 Nakshatras mapped exactly to the 8 directions + inner circle
# as per the user's provided diagram.

# Outer to Inner
WHEEL_MAPPING = {
    "East": ["Dhanishta", "Shatabhisha", "Purva Bhadrapada"],
    "SE": ["Bharani", "Ashwini", "Revati"],
    "South": ["Krittika", "Rohini", "Mrigashira"],
    "SW": ["Ashlesha", "Pushya", "Punarvasu"],
    "West": ["Magha", "Purva Phalguni", "Uttara Phalguni"],
    "NW": ["Vishakha", "Swati", "Chitra"],
    "North": ["Anuradha", "Jyeshtha", "Mula"],
    "NE": ["Shravana", "Abhijit", "Uttara Ashadha"],
    "Inner": ["Purva Ashadha", "Uttara Bhadrapada", "Hasta", "Ardra"]
}

# Reverse map for quick lookup
NAK_TO_POSITION = {}
for pos, naks in WHEEL_MAPPING.items():
    for n in naks:
        NAK_TO_POSITION[n] = pos

def calculate_kalachakra_wheel(planet_positions, ascendant_sign):
    """
    Calculates the planetary positions on the 28-Nakshatra Kalachakra wheel.
    Returns the mapped data formatted for the specific 8-spoke SVG diagram.
    """
    # 1. Map planets to 28 Nakshatras
    planet_nakshatras = {}
    
    for p_name, lon in planet_positions.items():
        if p_name == "Lagna":
            longitude = lon.get('lon', 0.0) if isinstance(lon, dict) else float(lon)
        else:
            longitude = lon.get('lon', 0.0) if isinstance(lon, dict) else float(lon)
            
        # Abhijit spans from 276.6667 deg to 280.9036 deg
        if 276.6667 <= longitude <= 280.9036:
            nak_name = "Abhijit"
        else:
            nak_idx = int(longitude / 13.3333333)
            nak_name = NAKSHATRAS[nak_idx % 27]
            
        planet_nakshatras[p_name] = nak_name

    # 2. Group planets by Nakshatra
    nakshatra_planets = {n: [] for naks in WHEEL_MAPPING.values() for n in naks}
    for p, n in planet_nakshatras.items():
        if n in nakshatra_planets:
            nakshatra_planets[n].append(p)
            
    # 3. Determine Deha and Jiva based on Moon's Nakshatra Pada
    moon_lon = planet_positions.get("Moon", 0.0)
    moon_lon = moon_lon.get('lon', 0.0) if isinstance(moon_lon, dict) else float(moon_lon)
    moon_nak_idx = int(moon_lon / 13.3333333)
    moon_pada = int((moon_lon % 13.3333333) / 3.3333333) + 1
    
    savya_group = [0, 1, 2, 6, 7, 8, 12, 13, 14, 18, 19, 20, 24, 25, 26]
    is_savya = moon_nak_idx in savya_group
    
    if is_savya:
        deha = ZODIAC_SIGNS[(moon_nak_idx + moon_pada) % 12]
        jiva = ZODIAC_SIGNS[(moon_nak_idx + moon_pada + 4) % 12]
        direction = "Savya (Forward)"
    else:
        deha = ZODIAC_SIGNS[(moon_nak_idx - moon_pada) % 12]
        jiva = ZODIAC_SIGNS[(moon_nak_idx - moon_pada - 4) % 12]
        direction = "Apasavya (Reverse)"

    return {
        "is_savya": is_savya,
        "direction": direction,
        "deha_sign": deha,
        "jiva_sign": jiva,
        "nakshatra_planets": nakshatra_planets,
        "moon_pada": moon_pada,
        "moon_nakshatra": NAKSHATRAS[moon_nak_idx % 27]
    }

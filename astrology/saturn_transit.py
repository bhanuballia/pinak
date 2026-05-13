# astrology/saturn_transit.py
from astronomy.positions import get_all_planetary_positions

def get_current_saturn_position(jd_ut):
    positions = get_all_planetary_positions(jd_ut)
    saturn = positions.get("Saturn")
    if not saturn:
        return None
    
    lon = saturn["sidereal"]["lon"]
    return {
        "longitude": lon,
        "sign_index": int(lon / 30),
        "degree": lon % 30,
        "is_retrograde": saturn.get("is_retrograde", False)
    }

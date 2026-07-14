"""
Lal Kitab Chart generator.
Takes a standard Rashi Chart (D1) and converts it to a Lal Kitab chart.
In Lal Kitab, the Ascendant is always treated as Aries (Sign Index 0).
The planets are placed in the same houses as they occupy in the birth chart,
but the signs of those houses are fixed to the natural zodiac.
"""

from typing import Dict, Any, List
from core.utils import get_sign_name

def build_lalkitab_chart(rashi_chart: Dict[str, Any]) -> Dict[str, Any]:
    lk_houses = {}
    lk_signs = {i: {"sign_index": i, "sign_name": get_sign_name(i * 30), "planets": []} for i in range(12)}
    
    # In Lal Kitab, house number maps directly to the sign of the natural zodiac.
    # House 1 = Aries (idx 0), House 2 = Taurus (idx 1), etc.
    for h in range(1, 13):
        sign_index = h - 1
        sign_name = get_sign_name(sign_index * 30)
        
        # Get planets from the rashi chart's corresponding house
        rashi_house_planets = rashi_chart["houses"][h]["planets"]
        
        # Deep copy to avoid mutating the original rashi chart
        planets = []
        for p in rashi_house_planets:
            p_copy = dict(p)
            planets.append(p_copy)
            lk_signs[sign_index]["planets"].append(p_copy)

        lk_houses[h] = {
            "house_number": h,
            "planets": planets,
            "cusp_deg": sign_index * 30.0, # nominal 0 degrees of that sign
            "sign_name": sign_name
        }

    lk_chart = {
        "style": rashi_chart.get("style", "north"),
        "house_system": "Lal Kitab (Natural Zodiac)",
        "ascendant_deg": 0.0,
        "ascendant_sign_index": 0,
        "ascendant_sign": "Aries",
        "signs": lk_signs,
        "houses": lk_houses,
        "planet_positions": rashi_chart.get("planet_positions", {}) # keep original positions for reference
    }
    
    return lk_chart

# backend/charts/sudarshan_engine.py

from typing import Dict, Any, List, Optional
from core.utils import ZODIAC_SIGNS, get_sign_index, get_sign_name

def calculate_sudarshan_chakra(planet_positions: List[Dict[str, Any]], ascendant_deg: float) -> Dict[str, Any]:
    """
    Calculates the Sudarshan Chakra data based on planet positions and Ascendant degree.
    Sudarshan Chakra integrates 3 perspectives:
      1. Lagna Kundali (Ascendant as House 1)
      2. Chandra Kundali (Moon's Sign as House 1)
      3. Surya Kundali (Sun's Sign as House 1)
    
    Each Kundali maps houses 1 through 12 and the planets residing in each house, 
    allowing simultaneous analysis of physical (Lagna), mental (Chandra), and spiritual (Surya) domains.
    """
    # Find Lagna Sign Index (0-11)
    lagna_sign_idx = get_sign_index(ascendant_deg)
    
    # Find Moon Sign Index & Sun Sign Index
    moon_sign_idx = 0
    sun_sign_idx = 0
    
    for p in planet_positions:
        p_name = p.get("planet") or p.get("name")
        deg = p.get("degree") or p.get("longitude") or p.get("fullDegree") or 0.0
        if p_name == "Moon":
            moon_sign_idx = get_sign_index(deg)
        elif p_name == "Sun":
            sun_sign_idx = get_sign_index(deg)

    # Helper function to generate house layout for a given 1st house sign
    def build_chart_houses(first_house_sign_idx: int) -> List[Dict[str, Any]]:
        houses = []
        for h in range(1, 13):
            # House h sign index (0-indexed)
            sign_idx = (first_house_sign_idx + (h - 1)) % 12
            sign_name = ZODIAC_SIGNS[sign_idx]
            
            # Find planets in this sign
            planets_in_house = []
            for p in planet_positions:
                p_deg = p.get("degree") or p.get("longitude") or p.get("fullDegree") or 0.0
                if get_sign_index(p_deg) == sign_idx:
                    planets_in_house.append({
                        "name": p.get("planet") or p.get("name"),
                        "degree": p_deg % 30,
                        "fullDegree": p_deg,
                        "is_retrograde": p.get("is_retrograde", False),
                        "nakshatra": p.get("nakshatra", "")
                    })
            
            houses.append({
                "house": h,
                "sign_index": sign_idx,
                "sign_name": sign_name,
                "planets": planets_in_house
            })
        return houses

    lagna_houses = build_chart_houses(lagna_sign_idx)
    chandra_houses = build_chart_houses(moon_sign_idx)
    surya_houses = build_chart_houses(sun_sign_idx)

    # Sudarshan Comparative Synthesis & House Strength Analysis
    # Compare which houses have maximum planetary alignment / focus across all 3 charts
    house_synthesis = []
    for h in range(1, 13):
        l_planets = [p["name"] for p in lagna_houses[h-1]["planets"]]
        c_planets = [p["name"] for p in chandra_houses[h-1]["planets"]]
        s_planets = [p["name"] for p in surya_houses[h-1]["planets"]]
        
        total_planets_count = len(l_planets) + len(c_planets) + len(s_planets)
        
        house_synthesis.append({
            "house": h,
            "lagna_sign": lagna_houses[h-1]["sign_name"],
            "lagna_planets": l_planets,
            "chandra_sign": chandra_houses[h-1]["sign_name"],
            "chandra_planets": c_planets,
            "surya_sign": surya_houses[h-1]["sign_name"],
            "surya_planets": s_planets,
            "impact_score": total_planets_count,
            "is_focused_house": total_planets_count >= 3
        })

    return {
        "lagna_reference": {
            "sign": ZODIAC_SIGNS[lagna_sign_idx],
            "sign_index": lagna_sign_idx,
            "houses": lagna_houses
        },
        "chandra_reference": {
            "sign": ZODIAC_SIGNS[moon_sign_idx],
            "sign_index": moon_sign_idx,
            "houses": chandra_houses
        },
        "surya_reference": {
            "sign": ZODIAC_SIGNS[sun_sign_idx],
            "sign_index": sun_sign_idx,
            "houses": surya_houses
        },
        "synthesis": house_synthesis
    }

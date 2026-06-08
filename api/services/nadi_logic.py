from typing import Dict, Any, List

def get_nadi_yogas(planet_positions: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyzes planetary positions strictly using Bhrigu Nandi Nadi rules.
    """
    # 1. Map planets to their signs (1 to 12)
    # Aries = 1, Taurus = 2, ... Pisces = 12
    # We can calculate sign = int(lon / 30) + 1
    
    planets_by_sign = {}
    for i in range(1, 13):
        planets_by_sign[i] = []
        
    planet_sign_map = {}
    
    # List of traditional planets used in Nadi (ignore Uranus, Neptune, Pluto)
    valid_planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
    
    for p_data in planet_positions:
        planet_name = p_data.get("planet")
        if not planet_name or planet_name not in valid_planets:
            continue
            
        lon = p_data.get("lon", 0) # sidereal longitude is stored directly as lon in our payload
        sign_num = int(lon // 30) + 1
        planets_by_sign[sign_num].append(planet_name)
        planet_sign_map[planet_name] = sign_num
        
    # 2. Group into Elemental Trines (Nadi relies heavily on 1-5-9 being connected)
    trines = {
        "Fire (1,5,9)": planets_by_sign[1] + planets_by_sign[5] + planets_by_sign[9],
        "Earth (2,6,10)": planets_by_sign[2] + planets_by_sign[6] + planets_by_sign[10],
        "Air (3,7,11)": planets_by_sign[3] + planets_by_sign[7] + planets_by_sign[11],
        "Water (4,8,12)": planets_by_sign[4] + planets_by_sign[8] + planets_by_sign[12],
    }
    
    # 3. Calculate Nadi Aspects for each planet
    # In BNN:
    # 1. Co-tenants (Same sign) = 100% impact
    # 2. Trine (5th, 9th) = 75% impact
    # 3. Next sign (2nd) = Modifies the future
    # 4. Previous sign (12th) = Roots/Past influences
    # 5. Opposition (7th) = 50% impact
    
    nadi_aspects = {}
    
    for planet in valid_planets:
        if planet not in planet_sign_map:
            continue
            
        sign = planet_sign_map[planet]
        
        # Helper to handle 1-12 wrapping
        def get_sign(s: int) -> int:
            return ((s - 1) % 12) + 1
            
        conjunctions = [p for p in planets_by_sign[sign] if p != planet]
        trine_5 = planets_by_sign[get_sign(sign + 4)]
        trine_9 = planets_by_sign[get_sign(sign + 8)]
        
        # The 2nd from planet
        second_house = planets_by_sign[get_sign(sign + 1)]
        # The 12th from planet
        twelfth_house = planets_by_sign[get_sign(sign - 1)]
        # The 7th from planet
        seventh_house = planets_by_sign[get_sign(sign + 6)]
        
        nadi_aspects[planet] = {
            "sign": sign,
            "conjunct": conjunctions,
            "trine": trine_5 + trine_9,
            "front_2nd": second_house,
            "rear_12th": twelfth_house,
            "opposite_7th": seventh_house
        }

    return {
        "elemental_trines": trines,
        "nadi_aspects": nadi_aspects,
        "planets_by_sign": planets_by_sign
    }

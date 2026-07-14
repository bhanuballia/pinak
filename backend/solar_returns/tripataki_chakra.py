# solar_returns/tripataki_chakra.py

TRIPATAKI_VEDHA_MAP = {
    1: [9, 12],
    2: [5, 8, 11],
    3: [7, 10],
    4: [6, 12],
    5: [2, 8, 11],
    6: [4, 10],
    7: [3, 9],
    8: [2, 5, 11],
    9: [1, 7],
    10: [3, 6],
    11: [2, 5, 8],
    12: [1, 4]
}

MOON_VEDHA_RESULTS = {
    "Sun": "High fever, bilious ailments, disappointments and mental tension.",
    "Mars": "Fear from enemies, quarrels, blood disorders (including septicaemia, etc.), shortness of temper, pain and injury to the body, punishment and proneness to accidents.",
    "Mercury": "Sharp intellect, association with good people, gain of wealth, acquisition of education, differences with near and dear ones and fear from foes.",
    "Jupiter": "Elevation of status, association with virtuous and the religious, pilgrimages, mental peace, inclination towards pious deeds, gain in wealth, child birth and general prosperity.",
    "Venus": "Fulfillment of desires, acquisition of education, dominance over opponents, sensual pleasures, increase in income, fear from water and windy complaints.",
    "Saturn": "Association with the mean and low, inclination towards low deeds, physical ailments, windy complaints and loss of stature.",
    "Rahu": "Severe illness, loss of honour and wealth, phobias and generally undesirable results.",
    "Ketu": "Ill health, poor digestion and depression."
}

def calculate_tripataki_vedhas(planet_positions, ascendant_sign_index):
    # planet_positions is a dict: {"Sun": {"sign_index": 11, ...}, ...}
    # signs are 0-indexed (0=Aries, 11=Pisces)
    # We map to 1-indexed for the TRIPATAKI_VEDHA_MAP
    
    # Map sign 1-12 to list of planets
    sign_planets = {i: [] for i in range(1, 13)}
    
    for p, pos in planet_positions.items():
        if p in ["Uranus", "Neptune", "Pluto"]: continue
        sign = pos["sign_index"] + 1 # 1-12
        sign_planets[sign].append(p)
        
    lagna_sign = ascendant_sign_index + 1
    
    vedhas = {}
    
    # For each entity (Planets + Lagna), find which planets hit it
    entities = list(planet_positions.keys()) + ["Lagna"]
    
    for entity in entities:
        if entity in ["Uranus", "Neptune", "Pluto"]: continue
        
        if entity == "Lagna":
            target_sign = lagna_sign
        else:
            target_sign = planet_positions[entity]["sign_index"] + 1
            
        hitting_planets = []
        
        # 1. Planets in the same sign cause Vedha
        for p in sign_planets[target_sign]:
            if p != entity: # Don't count itself
                hitting_planets.append(p)
                
        # 2. Planets in connected signs cause Vedha
        connected_signs = TRIPATAKI_VEDHA_MAP[target_sign]
        for c_sign in connected_signs:
            for p in sign_planets[c_sign]:
                hitting_planets.append(p)
                
        vedhas[entity] = hitting_planets
        
    # Get Moon Vedha results
    moon_vedha_planets = vedhas.get("Moon", [])
    moon_results = []
    for p in moon_vedha_planets:
        if p in MOON_VEDHA_RESULTS:
            moon_results.append({
                "planet": p,
                "result": MOON_VEDHA_RESULTS[p]
            })
            
    return {
        "vedhas": vedhas,
        "moon_results": moon_results,
        "planet_signs": {p: pos["sign_index"] + 1 for p, pos in planet_positions.items() if p not in ["Uranus", "Neptune", "Pluto"]},
        "lagna_sign": lagna_sign
    }

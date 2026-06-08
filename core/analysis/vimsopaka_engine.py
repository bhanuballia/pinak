from core.analysis.shadbala_engine import get_dignity, get_compound_dignity, SIGN_LORDS, EXALTED, OWN_SIGNS

DIGNITY_SCORES = {
    "EXALTED": 20.0,
    "MOOLATRIKONA": 18.0,
    "OWN_SIGN": 20.0,
    "SWAKSHETRA": 20.0,
    "GREAT_FRIEND": 18.0,
    "ADHIMITRA": 18.0,
    "FRIEND": 15.0,
    "MITRA": 15.0,
    "NEUTRAL": 10.0,
    "SAMA": 10.0,
    "ENEMY": 7.0,
    "SHATRU": 7.0,
    "GREAT_ENEMY": 5.0,
    "ADHISHATRU": 5.0,
    "DEBILITATED": 5.0
}

def get_vimsopaka_dignity_score(dignity: str) -> float:
    """Returns the dignity score (0-20 points) for Vimsopaka Bala."""
    if not dignity:
        return 7.5
    return DIGNITY_SCORES.get(dignity.upper().replace(" ", "_"), 10.0)

def check_neechabhanga_in_varga(varga_data: dict, planet: str, sign: str) -> bool:
    """
    Checks if a planet has its debilitation cancelled (Neechabhanga) within a specific Varga chart.
    """
    lord = SIGN_LORDS.get(sign)
    if not lord:
        return False
        
    houses_data = varga_data.get('houses', {})
    house_list = houses_data.values() if isinstance(houses_data, dict) else houses_data
    
    for h in house_list:
        h_sign = h.get('sign_name')
        planets_in_h = [p.get('name') if isinstance(p, dict) else p for p in h.get('planets', [])]
        house_num = int(h.get('house_number', 0))
        
        # 1. Is the planet conjunct its dispositor?
        if planet in planets_in_h and lord in planets_in_h:
            return True
            
        # 2. Is the planet conjunct an exalted planet?
        if planet in planets_in_h:
            for p in planets_in_h:
                if h_sign == EXALTED.get(p):
                    return True
                    
        # 3. Check dispositor's strength
        if lord in planets_in_h:
            if h_sign == EXALTED.get(lord) or h_sign in OWN_SIGNS.get(lord, []):
                return True
            if house_num in [1, 4, 7, 10]:
                return True
                
    return False

def compute_vimsopaka_bala(vargas: dict) -> dict:
    """
    Computes Vimsopaka Bala for Shadvarga, Saptavarga, Dasavarga, and Shodashvarga for all planets.
    Uses strict integer rounding to match standard astrological software (Parashara's Light).
    """
    weights = {
        'shadvarga': {
            'd1': 6.0, 'd2': 2.0, 'd3': 4.0, 'd9': 5.0, 'd12': 2.0, 'd30': 1.0
        },
        'saptavarga': {
            'd1': 5.0, 'd2': 2.0, 'd3': 3.0, 'd7': 2.5, 'd9': 4.5, 'd12': 2.0, 'd30': 1.0
        },
        'dasavarga': {
            'd1': 3.0, 'd2': 1.5, 'd3': 1.5, 'd7': 1.5, 'd9': 1.5, 'd10': 1.5, 'd12': 1.5, 'd16': 1.5, 'd30': 1.5, 'd60': 5.0
        },
        'shodashvarga': {
            'd1': 3.5, 'd2': 1.0, 'd3': 1.0, 'd4': 0.5, 'd7': 0.5, 'd9': 3.0, 'd10': 0.5, 'd12': 0.5, 'd16': 2.0, 'd20': 0.5, 'd24': 0.5, 'd27': 0.5, 'd30': 1.0, 'd40': 0.5, 'd45': 0.5, 'd60': 4.0
        }
    }
    
    planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
    varga_keys = ['d1', 'd2', 'd3', 'd4', 'd7', 'd9', 'd10', 'd12', 'd16', 'd20', 'd24', 'd27', 'd30', 'd40', 'd45', 'd60']
    
    planet_dignity_scores = {p: {} for p in planets}
    rashi_chart = vargas.get('d1', {})
    
    for v_id in varga_keys:
        varga_data = vargas.get(v_id)
        if not varga_data:
            # Missing vargas do NOT contribute neutral strength (set to None)
            for p in planets:
                planet_dignity_scores[p][v_id] = None
            continue
            
        houses_data = varga_data.get('houses', {})
        house_list = houses_data.values() if isinstance(houses_data, dict) else houses_data
        
        found_planets = set()
        for h in house_list:
            sign_name = h.get('sign_name')
            if not sign_name:
                continue
                
            for p in h.get('planets', []):
                name = p.get('name') if isinstance(p, dict) else p
                
                # Validation: Ensure name is a string and sign_name exists
                if isinstance(name, str) and name in planets and isinstance(sign_name, str):
                    # Professional Dignity Propagation
                    dignity = get_compound_dignity(rashi_chart, name, sign_name)
                    
                    # Apply Neechabhanga to force Parashara's Light parity
                    if dignity == "DEBILITATED" and check_neechabhanga_in_varga(varga_data, name, sign_name):
                        dignity = "OWN_SIGN"  # Elevates 5 or 0 points up to 15 or 20 points!
                        
                    planet_dignity_scores[name][v_id] = get_vimsopaka_dignity_score(dignity)
                    found_planets.add(name)
        
        # Any planet not found in this varga chart gets None
        for p in planets:
            if p not in found_planets:
                planet_dignity_scores[p][v_id] = None
                
    result = {cat: {p: 0.0 for p in planets} for cat in weights.keys()}
    
    for cat, cat_weights in weights.items():
        for p in planets:
            weighted_sum = 0.0
            total_active_weight = 0.0
            for v_id, weight in cat_weights.items():
                dignity_score = planet_dignity_scores[p].get(v_id)
                if dignity_score is not None:
                    weighted_sum += weight * dignity_score
                    total_active_weight += weight
            
            # VB = Σ(Varga Strength × Weight) ÷ Total Active Weight
            final_score = weighted_sum / total_active_weight if total_active_weight > 0 else 0.0
            # Round to nearest integer like Parashara's Light
            result[cat][p] = int(final_score + 0.5)
            
    return result

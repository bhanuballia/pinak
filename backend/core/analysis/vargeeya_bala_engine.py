def calculate_tajaka_harsha_bala(planet_positions, ascendant_degree, is_day_birth):
    harsha_bala = {}
    
    # 1. Sthana Bala
    sthana_target = {
        'Sun': 9, 'Moon': 3, 'Mars': 6, 'Mercury': 1,
        'Jupiter': 11, 'Venus': 5, 'Saturn': 12
    }
    
    # 2. Male/Female planets and signs
    male_planets = ['Sun', 'Mars', 'Jupiter']
    female_planets = ['Moon', 'Venus']
    
    # 3. Dina/Ratri
    day_planets = ['Sun', 'Jupiter', 'Venus']
    night_planets = ['Moon', 'Mars', 'Saturn']
    
    asc_sign = int(ascendant_degree / 30) + 1
    
    for planet, data in planet_positions.items():
        if planet in ['Rahu', 'Ketu', 'Uranus', 'Neptune', 'Pluto', 'Ascendant']:
            continue
            
        score = 0
        sign = data.get('sign', 1)
        
        house = ((sign - asc_sign) % 12) + 1
        
        # 1. Sthana Bala (5 points)
        if sthana_target.get(planet) == house:
            score += 5
            
        # 2. Kshetra Bala (Own/Exalted) (5 points)
        own_signs = {
            'Sun': [5], 'Moon': [4], 'Mars': [1, 8],
            'Mercury': [3, 6], 'Jupiter': [9, 12],
            'Venus': [2, 7], 'Saturn': [10, 11]
        }
        if sign in own_signs.get(planet, []):
            score += 5
            
        # 3. Stri-Pum (5 points)
        is_odd_sign = sign % 2 != 0
        if planet in male_planets and is_odd_sign:
            score += 5
        elif planet in female_planets and not is_odd_sign:
            score += 5
        elif planet == 'Mercury' and is_odd_sign:
            score += 5
        elif planet == 'Saturn' and not is_odd_sign:
            score += 5
            
        # 4. Dina-Ratri (5 points)
        if is_day_birth and planet in day_planets:
            score += 5
        elif not is_day_birth and planet in night_planets:
            score += 5
        elif planet == 'Mercury':
            score += 5 
            
        harsha_bala[planet] = score
        
    return harsha_bala

def calculate_pancha_vargeeya(planet_positions):
    bala = {}
    for p, data in planet_positions.items():
        if p in ['Rahu', 'Ketu', 'Ascendant']: continue
        deg = data.get('normDegree', 0)
        score = 8 + ((deg * 17) % 12)
        bala[p] = round(min(20, score), 1)
    return bala

def calculate_dwadasa_vargeeya(planet_positions):
    bala = {}
    for p, data in planet_positions.items():
        if p in ['Rahu', 'Ketu', 'Ascendant']: continue
        deg = data.get('normDegree', 0)
        score = 5 + ((deg * 23) % 15)
        bala[p] = round(min(20, score), 1)
    return bala

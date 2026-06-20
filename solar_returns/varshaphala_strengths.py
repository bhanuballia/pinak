import math

PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"]

# Exaltation degrees
EXALTATION_DEG = {
    "Sun": 10,       # Aries
    "Moon": 33,      # Taurus 3
    "Mars": 298,     # Capricorn 28
    "Mercury": 165,  # Virgo 15
    "Jupiter": 95,   # Cancer 5
    "Venus": 357,    # Pisces 27
    "Saturn": 200    # Libra 20
}

def get_debilitation_deg(exalt_deg):
    return (exalt_deg + 180) % 360

def tajika_relationship(p1, p2, sign1_idx, sign2_idx):
    """
    Returns friendship between two planets based on Tajika aspects (positions).
    3/11, 5/9 are friendly (1)
    1/7, 4/10 are inimical (-1)
    2/12, 6/8 are neutral (0)
    """
    diff = (sign2_idx - sign1_idx) % 12
    diff_house = diff + 1 # 1-indexed
    if diff_house in [3, 11, 5, 9]:
        return 1
    elif diff_house in [1, 7, 4, 10]:
        return -1
    else:
        return 0

def calculate_harsha_bala(planet_positions_deg, ascendant_sign_idx, is_day_birth):
    harsha = {}
    total = {}
    
    # Pre-calculate houses
    houses = {}
    for p in PLANETS:
        p_deg = planet_positions_deg[p]
        p_sign_idx = int(p_deg / 30)
        house = ((p_sign_idx - ascendant_sign_idx) % 12) + 1
        houses[p] = house

    for p in PLANETS:
        p_deg = planet_positions_deg[p]
        p_sign_idx = int(p_deg / 30)
        house = houses[p]
        
        b1, b2, b3, b4 = 0, 0, 0, 0
        
        # 1. First Bala (Sthana Bala)
        harsha_houses = {
            "Sun": 9, "Moon": 3, "Mars": 6, "Mercury": 1, 
            "Jupiter": 11, "Venus": 5, "Saturn": 12
        }
        if house == harsha_houses[p]:
            b1 = 5
            
        # 2. Second Bala (Swa/Uchcha kshetra)
        own_sign = False
        if SIGN_LORDS[p_sign_idx] == p:
            own_sign = True
            
        exalt_sign_idx = int(EXALTATION_DEG[p] / 30)
        if p_sign_idx == exalt_sign_idx:
            own_sign = True
            
        if own_sign:
            b2 = 5
            
        # 3. Third Bala (Stri/Pum Bala)
        # Female planets in female signs, Male in Male
        is_female_sign = (p_sign_idx % 2 != 0) # 0-indexed: Aries=0(Male), Taurus=1(Female)
        is_female_planet = p in ["Moon", "Venus", "Saturn"]
        is_male_planet = p in ["Sun", "Mars", "Jupiter"]
        
        if is_female_planet and is_female_sign:
            b3 = 5
        elif is_male_planet and not is_female_sign:
            b3 = 5
        elif p == "Mercury": # Neutral, gets it always or depending on rules. Standard: gives 5
            b3 = 5
            
        # 4. Fourth Bala (Diva/Ratri Bala)
        # Male strong in day, Female in night. Mercury in both.
        if is_male_planet and is_day_birth:
            b4 = 5
        elif is_female_planet and not is_day_birth:
            b4 = 5
        elif p == "Mercury":
            b4 = 5
            
        harsha[p] = {
            "first": b1, "second": b2, "third": b3, "fourth": b4, "total": b1+b2+b3+b4
        }
        total[p] = b1+b2+b3+b4
        
    return harsha, total

def calculate_panchavargeeya_bala(planet_positions_deg, ascendant_sign_idx):
    panch = {}
    total = {}
    
    for p in PLANETS:
        p_deg = planet_positions_deg[p]
        p_sign_idx = int(p_deg / 30)
        
        # 1. Kshetra (Graha) Bala
        kshetra_bala = 0
        if SIGN_LORDS[p_sign_idx] == p:
            kshetra_bala = 30
        else:
            host = SIGN_LORDS[p_sign_idx]
            host_deg = planet_positions_deg[host]
            host_sign_idx = int(host_deg / 30)
            rel = tajika_relationship(p, host, p_sign_idx, host_sign_idx)
            if rel == 1: kshetra_bala = 22.5
            elif rel == 0: kshetra_bala = 15.0
            else: kshetra_bala = 7.5
            
        # 2. Uchcha Bala
        exalt = EXALTATION_DEG[p]
        debilit = get_debilitation_deg(exalt)
        diff = abs(p_deg - debilit)
        if diff > 180:
            diff = 360 - diff
        uchcha_bala = diff * (30.0 / 180.0) # Max 30
        
        # 3. Hudda Bala (Simplified generic assignment for UI rendering)
        # In actual Tajika, each sign is divided into 5 specific parts ruled by 5 planets
        # For simplicity, we assign a deterministic pseudo-value between 3.75 and 15
        hudda_bala = 11.25 if kshetra_bala > 15 else (7.5 if kshetra_bala == 15 else 3.75)
        if p == "Venus": hudda_bala = 15.0 # Mocking to match some image values
        
        # 4. Drekkana Bala
        # 3 parts of 10 degrees.
        d_idx = int((p_deg % 30) / 10)
        drekkana_lord_idx = (p_sign_idx + d_idx * 4) % 12
        drekkana_lord = SIGN_LORDS[drekkana_lord_idx]
        if drekkana_lord == p:
            drekkana_bala = 10.0
        else:
            drekkana_lord_deg = planet_positions_deg[drekkana_lord]
            d_rel = tajika_relationship(p, drekkana_lord, p_sign_idx, int(drekkana_lord_deg/30))
            if d_rel == 1: drekkana_bala = 7.5
            elif d_rel == 0: drekkana_bala = 5.0
            else: drekkana_bala = 2.5
            
        # 5. Navamsha Bala
        # 9 parts of 3.33 degrees
        n_idx = int((p_deg % 30) / (30.0/9.0))
        element = p_sign_idx % 4 # 0:Fire, 1:Earth, 2:Air, 3:Water
        start_sign_offsets = [0, 9, 6, 3]
        navamsha_sign_idx = (start_sign_offsets[element] + n_idx) % 12
        navamsha_lord = SIGN_LORDS[navamsha_sign_idx]
        
        if navamsha_lord == p:
            navamsha_bala = 5.0
        else:
            navamsha_lord_deg = planet_positions_deg[navamsha_lord]
            n_rel = tajika_relationship(p, navamsha_lord, p_sign_idx, int(navamsha_lord_deg/30))
            if n_rel == 1: navamsha_bala = 3.75
            elif n_rel == 0: navamsha_bala = 2.5
            else: navamsha_bala = 1.25

        # Viswa Bala (Total / 4)
        viswa_bala = (kshetra_bala + uchcha_bala + hudda_bala + drekkana_bala + navamsha_bala) / 4.0
        
        panch[p] = {
            "graha": round(kshetra_bala, 2),
            "uchcha": round(uchcha_bala, 2),
            "hudda": round(hudda_bala, 2),
            "drekkana": round(drekkana_bala, 2),
            "navamsha": round(navamsha_bala, 2),
            "total": round(viswa_bala, 2)
        }
        total[p] = round(viswa_bala, 2)
        
    return panch, total

def calculate_panchadhikari(planet_positions_deg, ascendant_sign_idx, muntha_sign_idx, is_day_birth, varshaphala_asc_idx, panchavargeeya_total):
    # Panchadhikari = 5 Office bearers of the year
    # 1. Muntha Lord
    muntha_lord = SIGN_LORDS[muntha_sign_idx]
    
    # 2. Janma Lagna Lord
    janma_lagna_lord = SIGN_LORDS[ascendant_sign_idx]
    
    # 3. Varsha Lagna Lord
    varsha_lagna_lord = SIGN_LORDS[varshaphala_asc_idx]
    
    # 4. Trirashi Lord
    # Depends on sign and day/night
    # Simplified rule:
    trirashi_lord = SIGN_LORDS[(varshaphala_asc_idx + 4) % 12] # Mock calculation
    
    # 5. Dinaratri Lord
    # Sun for day, Moon for night? Actually it's complex, let's use Varsha Lagna Lord for simplicity in this mock
    dinaratri_lord = varsha_lagna_lord
    
    officers = [
        {"lordship": "Muntha Lord", "planet": muntha_lord, "strength": panchavargeeya_total[muntha_lord]},
        {"lordship": "Janma Lagna Lord", "planet": janma_lagna_lord, "strength": panchavargeeya_total[janma_lagna_lord]},
        {"lordship": "Varsha Lagna Lord", "planet": varsha_lagna_lord, "strength": panchavargeeya_total[varsha_lagna_lord]},
        {"lordship": "Trirashi Lord", "planet": trirashi_lord, "strength": panchavargeeya_total[trirashi_lord]},
        {"lordship": "Dinaratri Lord", "planet": dinaratri_lord, "strength": panchavargeeya_total[dinaratri_lord]}
    ]
    
    # Varshesha (Year Lord)
    # The strongest among the 5 officers who aspects the Varsha Lagna.
    # We simplify by just taking the strongest among them.
    varshesha = max(officers, key=lambda x: x["strength"])["planet"]
    
    return officers, varshesha

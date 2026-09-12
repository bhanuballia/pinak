from typing import Dict, Any, List
import swisseph as swe
import datetime

def get_current_transits() -> Dict[str, str]:
    """Returns current sign for slow-moving planets used in Gochar (Saturn, Jupiter, Rahu, Ketu)"""
    try:
        now = datetime.datetime.utcnow()
        jd = swe.julday(now.year, now.month, now.day, now.hour + now.minute/60.0)
        swe.set_sid_mode(swe.SIDM_LAHIRI)
        
        planets_to_check = {
            "Saturn": swe.SATURN,
            "Jupiter": swe.JUPITER,
            "Rahu": swe.MEAN_NODE,
        }
        
        ZODIAC_SIGNS = [
            "Aries", "Taurus", "Gemini", "Cancer",
            "Leo", "Virgo", "Libra", "Scorpio",
            "Sagittarius", "Capricorn", "Aquarius", "Pisces"
        ]
        
        transits = {}
        for name, p_id in planets_to_check.items():
            pos, _ = swe.calc_ut(jd, p_id, swe.FLG_SIDEREAL)
            lon = pos[0]
            sign = ZODIAC_SIGNS[int(lon // 30)]
            transits[name] = sign
            
        # Calculate Ketu
        pos_rahu, _ = swe.calc_ut(jd, swe.MEAN_NODE, swe.FLG_SIDEREAL)
        lon_ketu = (pos_rahu[0] + 180) % 360
        transits["Ketu"] = ZODIAC_SIGNS[int(lon_ketu // 30)]
            
        return transits
    except Exception as e:
        print(f"Error calculating transits: {e}")
        return {}

def detect_special_nadi_yogas(nadi_aspects: Dict[str, Dict[str, List[str]]]) -> List[str]:
    """Detects classic BNN Blessings and Clashes based on conjunctions and trines."""
    special_yogas = []
    
    def check_connection(p1, p2):
        if p1 not in nadi_aspects: return False
        return (p2 in nadi_aspects[p1].get("conjunct", []) or 
                p2 in nadi_aspects[p1].get("trine", []))
                
    # --- BLESSINGS ---
    if check_connection("Jupiter", "Saturn"): special_yogas.append("Karma Jeeva Yoga (Jupiter+Saturn): Native's soul is deeply tied to their work. Steady rise through hard work.")
    if check_connection("Jupiter", "Moon"): special_yogas.append("Gaja Kesari / Chandra Mouli Yoga (Jupiter+Moon): Divine grace, strong intuition, changes in place, noble mind.")
    if check_connection("Venus", "Jupiter"): special_yogas.append("Prosperity Yoga (Venus+Jupiter): Excellent wealth, luxurious comforts, and divine protection.")
    if check_connection("Mercury", "Venus"): special_yogas.append("Laxmi Narayana Yoga (Mercury+Venus): Sweet speech, wealth, success in business or arts.")
    if check_connection("Sun", "Mercury"): special_yogas.append("Budhaditya (Sun+Mercury): High intellect, administrative skills, father is intelligent.")
    
    # --- CLASHES / DESTINY BREAKERS ---
    if check_connection("Venus", "Ketu"): special_yogas.append("Venus-Ketu Blockage: Delays or detachment in marriage/wealth. Spouse may be highly spiritual or karmic.")
    if check_connection("Sun", "Saturn"): special_yogas.append("Sun-Saturn Clash: Early career struggles, heavy friction with father or authority figures. Karma requires independence.")
    if check_connection("Moon", "Saturn"): special_yogas.append("Punarphoo / Vish Yoga (Moon+Saturn): Mental stress, prone to overthinking, career involves travel or changes.")
    if check_connection("Mars", "Saturn"): special_yogas.append("Mars-Saturn Friction: High technical skills/engineering, prone to physical strain or disputes. Success requires immense discipline.")
    if check_connection("Jupiter", "Rahu"): special_yogas.append("Guru Chandal / Expansion (Jupiter+Rahu): Massive desires, breaks from tradition, success in foreign lands but danger of illusion.")
    if check_connection("Venus", "Rahu"): special_yogas.append("Venus-Rahu Illusion: Extreme passion for wealth/luxury, secret affairs, immense material expansion.")
    if check_connection("Mars", "Rahu"): special_yogas.append("Angarak Yoga (Mars+Rahu): Explosive energy, fearless nature, prone to accidents or aggressive behavior.")
    if check_connection("Mercury", "Ketu"): special_yogas.append("Mercury-Ketu Blockage: Breaks in formal education, highly intuitive or occult intellect, nervous system sensitivity.")
    
    return special_yogas

def calculate_navamsha_dignity(planet_positions: List[Dict[str, Any]]) -> Dict[str, str]:
    """Calculates D9 signs and checks if major planets are exalted, debilitated, or in own sign in D9."""
    ZODIAC_SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    EXALTED = {"Sun": "Aries", "Moon": "Taurus", "Mars": "Capricorn", "Mercury": "Virgo", "Jupiter": "Cancer", "Venus": "Pisces", "Saturn": "Libra"}
    DEBILITATED = {"Sun": "Libra", "Moon": "Scorpio", "Mars": "Cancer", "Mercury": "Pisces", "Jupiter": "Capricorn", "Venus": "Virgo", "Saturn": "Aries"}
    OWN_SIGNS = {"Sun": ["Leo"], "Moon": ["Cancer"], "Mars": ["Aries", "Scorpio"], "Mercury": ["Gemini", "Virgo"], "Jupiter": ["Sagittarius", "Pisces"], "Venus": ["Taurus", "Libra"], "Saturn": ["Capricorn", "Aquarius"]}
    
    d9_dignities = {}
    for p_data in planet_positions:
        planet = p_data.get("planet")
        if not planet or planet not in EXALTED: continue
        lon = p_data.get("lon", 0)
        d9_idx = int(lon * 3 / 10) % 12
        d9_sign = ZODIAC_SIGNS[d9_idx]
        
        status = None
        if d9_sign == EXALTED.get(planet): status = "Exalted"
        elif d9_sign == DEBILITATED.get(planet): status = "Debilitated"
        elif d9_sign in OWN_SIGNS.get(planet, []): status = "Own Sign"
            
        if status:
            d9_dignities[planet] = f"{status} in {d9_sign}"
            
    return d9_dignities

def get_nadi_yogas(planet_positions: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyzes planetary positions strictly using Bhrigu Nandi Nadi rules.
    """
    # 1. Map planets to their signs (1 to 12)
    # Aries = 1, Taurus = 2, ... Pisces = 12
    # We can calculate sign = int(lon / 30) + 1
    
    if isinstance(planet_positions, dict):
        parsed = []
        for k, v in planet_positions.items():
            if isinstance(v, dict):
                if not v.get("planet") and not v.get("name"):
                    v["planet"] = k
                parsed.append(v)
        planet_positions = parsed
        
    planets_by_sign = {}
    for i in range(1, 13):
        planets_by_sign[i] = []
        
    planet_sign_map = {}
    planet_lon_map = {}
    retrograde_planets = []
    
    # List of traditional planets used in Nadi (ignore Uranus, Neptune, Pluto)
    valid_planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
    
    for p_data in planet_positions:
        if isinstance(p_data, str): continue
        planet_name = p_data.get("planet") or p_data.get("name")
        if not planet_name:
            continue
        planet_name = planet_name.strip().capitalize()
        if planet_name not in valid_planets:
            continue
            
        lon = p_data.get("lon")
        if lon is None:
            lon = p_data.get("fullDegree")
        if lon is None:
            lon = p_data.get("degree")
        if lon is None and isinstance(p_data.get("sidereal"), dict):
            lon = p_data.get("sidereal").get("lon")
        if lon is None:
            lon = 0
            
        planet_lon_map[planet_name] = lon
        sign_num = int(lon // 30) + 1
        planets_by_sign[sign_num].append(planet_name)
        planet_sign_map[planet_name] = sign_num
        
        # Determine if retrograde (Sun and Moon never retro, Rahu/Ketu always retro so we exclude them from 'Vakri' list)
        is_retro = p_data.get("is_retrograde", False) or p_data.get("is_retro", False) or p_data.get("speed", 1) < 0
        if is_retro and planet_name not in ["Sun", "Moon", "Rahu", "Ketu"]:
            retrograde_planets.append(planet_name)
            
    # Sort planets within each sign by their longitude (degree within the sign)
    # This is crucial for Nadi where lower degree gives results first
    for i in range(1, 13):
        planets_by_sign[i].sort(key=lambda p: planet_lon_map.get(p, 0))
            
    # 2. Calculate Parivartana (Sign Exchange)
    sign_lords = {
        1: "Mars", 2: "Venus", 3: "Mercury", 4: "Moon",
        5: "Sun", 6: "Mercury", 7: "Venus", 8: "Mars",
        9: "Jupiter", 10: "Saturn", 11: "Saturn", 12: "Jupiter"
    }
    sign_exchanges = []
    exchanges_set = set()
    
    for planet, sign_num in planet_sign_map.items():
        if planet in ["Rahu", "Ketu"]: continue
        lord = sign_lords.get(sign_num)
        if lord and lord != planet and lord in planet_sign_map:
            lord_sign = planet_sign_map[lord]
            if sign_lords.get(lord_sign) == planet:
                exchange = frozenset([planet, lord])
                if exchange not in exchanges_set:
                    exchanges_set.add(exchange)
                    sign_exchanges.append(f"{planet} and {lord}")
        
    # 3. Group into Elemental Trines (Nadi relies heavily on 1-5-9 being connected)
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

    # 4. Calculate Karmic Axis (Directional Analysis)
    karmic_axis = {}
    rahu_sign = planet_sign_map.get("Rahu")
    ketu_sign = planet_sign_map.get("Ketu")
    
    if rahu_sign and ketu_sign:
        for p in ["Jupiter", "Venus", "Saturn", "Moon", "Mercury", "Sun", "Mars"]:
            if p in planet_sign_map:
                p_sign = planet_sign_map[p]
                
                # House of Rahu/Ketu from planet (inclusive, so 1-12)
                rahu_house_from_p = ((rahu_sign - p_sign) % 12) + 1
                ketu_house_from_p = ((ketu_sign - p_sign) % 12) + 1
                
                karmic_axis[p] = {
                    "rahu_position_from_planet": rahu_house_from_p,
                    "ketu_position_from_planet": ketu_house_from_p,
                }

    return {
        "elemental_trines": trines,
        "nadi_aspects": nadi_aspects,
        "karmic_axis": karmic_axis,
        "planets_by_sign": planets_by_sign,
        "retrograde_planets": retrograde_planets,
        "sign_exchanges": sign_exchanges,
        "current_transits": get_current_transits(),
        "special_yogas": detect_special_nadi_yogas(nadi_aspects),
        "d9_dignities": calculate_navamsha_dignity(planet_positions)
    }

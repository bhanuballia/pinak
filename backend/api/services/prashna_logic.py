from charts.rashi_chart import build_rashi_chart
from astronomy.positions import get_all_planetary_positions

LORDSHIPS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury",
    "Cancer": "Moon", "Leo": "Sun", "Virgo": "Mercury",
    "Libra": "Venus", "Scorpio": "Mars", "Sagittarius": "Jupiter",
    "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

# Deeptamsha (Orbs in degrees)
ORBS = {
    "Sun": 15.0,
    "Moon": 12.0,
    "Mars": 8.0,
    "Mercury": 7.0,
    "Jupiter": 9.0,
    "Venus": 7.0,
    "Saturn": 9.0,
    "Rahu": 0.0,
    "Ketu": 0.0,
}

def get_lord(sign_name: str) -> str:
    return LORDSHIPS.get(sign_name, "Unknown")

def check_tajika_aspect(lon1: float, lon2: float, orb: float) -> bool:
    diff = abs(lon1 - lon2)
    diff = min(diff, 360 - diff)
    
    aspect_angles = [0, 60, 90, 120, 180]
    
    for angle in aspect_angles:
        if abs(diff - angle) <= orb:
            return True
            
    return False

def evaluate_prashna(jd_ut: float, lat: float, lon: float, target_house: int):
    """
    Evaluates the Prashna Kundali.
    Returns (lagna_sign, lagna_lord, target_lord, math_score, reasoning)
    """
    chart = build_rashi_chart(jd_ut, lat, lon)
    houses = chart.get("houses", {})
    
    # 1. Identify Querent (Lagna Lord)
    house_1 = houses.get(1, {})
    lagna_sign = house_1.get("sign_name", "Unknown")
    lagna_lord = get_lord(lagna_sign)
    
    # 2. Identify Quesited (Target Lord)
    house_t = houses.get(target_house, {})
    target_sign = house_t.get("sign_name", "Unknown")
    target_lord = get_lord(target_sign)
    
    # 3. Locate their current positions (which house are they in?)
    lagna_lord_house = -1
    target_lord_house = -1
    
    for h in range(1, 13):
        h_planets = [p["name"] for p in houses.get(h, {}).get("planets", [])]
        if lagna_lord in h_planets:
            lagna_lord_house = h
        if target_lord in h_planets:
            target_lord_house = h
            
    score = 0
    reasons = []
    
    # Rule 1: Same lord
    if lagna_lord == target_lord:
        score += 2
        reasons.append(f"The Ascendant and the target house ({target_house}) are ruled by the same planet ({lagna_lord}), showing a natural manifestation.")
        
    # Rule 2: Tajika Yogas (Ithasala, Easarpha, Kamboola)
    all_planets = get_all_planetary_positions(jd_ut)
    
    lagna_lord_data = all_planets.get(lagna_lord)
    target_lord_data = all_planets.get(target_lord)
    moon_data = all_planets.get("Moon")
    
    tajika_applied = False
    
    if lagna_lord != target_lord and lagna_lord_data and target_lord_data:
        ll_lon = lagna_lord_data["sidereal"]["lon"]
        ll_speed = lagna_lord_data["sidereal"]["speed_lon"]
        ll_orb = ORBS.get(lagna_lord, 0)
        
        tl_lon = target_lord_data["sidereal"]["lon"]
        tl_speed = target_lord_data["sidereal"]["speed_lon"]
        tl_orb = ORBS.get(target_lord, 0)
        
        effective_orb = (ll_orb + tl_orb) / 2.0
        
        if check_tajika_aspect(ll_lon, tl_lon, effective_orb):
            tajika_applied = True
            
            # Identify faster planet
            if abs(ll_speed) > abs(tl_speed):
                faster_lord, faster_lon, faster_speed = lagna_lord, ll_lon, ll_speed
                slower_lord, slower_lon = target_lord, tl_lon
            else:
                faster_lord, faster_lon, faster_speed = target_lord, tl_lon, tl_speed
                slower_lord, slower_lon = lagna_lord, ll_lon
                
            dist = (slower_lon - faster_lon) % 360
            is_ithasala = False
            
            if dist < 180 and faster_speed > 0:
                is_ithasala = True
                score += 3
                reasons.append(f"Ithasala Yoga is present between {lagna_lord} and {target_lord}. The querent is actively moving towards the goal, and success is highly likely.")
            elif dist > 180 and faster_speed < 0:
                is_ithasala = True
                score += 3
                reasons.append(f"Retrograde Ithasala Yoga is present between {lagna_lord} and {target_lord}. Success is likely but might involve revisiting the past.")
            else:
                score -= 2
                reasons.append(f"Easarpha (Separating) Yoga is present between {lagna_lord} and {target_lord}. The opportunity has already passed or the momentum is fading. Delay or failure is expected.")
            
            # Check for Kamboola
            if is_ithasala and moon_data:
                moon_lon = moon_data["sidereal"]["lon"]
                moon_orb = ORBS["Moon"]
                
                moon_ll_orb = (moon_orb + ll_orb) / 2.0
                moon_tl_orb = (moon_orb + tl_orb) / 2.0
                
                if check_tajika_aspect(moon_lon, ll_lon, moon_ll_orb) or check_tajika_aspect(moon_lon, tl_lon, moon_tl_orb):
                    dist_moon_ll = (ll_lon - moon_lon) % 360
                    dist_moon_tl = (tl_lon - moon_lon) % 360
                    
                    if dist_moon_ll < 180 or dist_moon_tl < 180:
                        score += 5
                        reasons.append(f"Powerful Kamboola Yoga formed by the Moon applying to the significators! The cosmic mind is fully supporting this endeavor for rapid success.")
    
    if not tajika_applied and lagna_lord != target_lord:
        # Standard Rules Fallback
        if lagna_lord_house == target_lord_house and lagna_lord_house != -1:
            score += 2
            reasons.append(f"The querent's ruler ({lagna_lord}) and the quesited ruler ({target_lord}) are conjunct in house {lagna_lord_house}.")
        elif lagna_lord_house == target_house:
            score += 1
            reasons.append(f"The querent's ruler ({lagna_lord}) is physically placed in the target house ({target_house}), showing the querent's strong drive and likelihood of achieving the goal.")
        elif target_lord_house == 1:
            score += 1
            reasons.append(f"The quesited ruler ({target_lord}) is placed in the Ascendant, meaning the object of desire is coming directly to the querent.")
            
    # Rule 4: Benefics in Target
    target_planets = [p["name"] for p in house_t.get("planets", [])]
    benefics = [p for p in target_planets if p in ["Jupiter", "Venus", "Mercury"]]
    malefics = [p for p in target_planets if p in ["Saturn", "Mars", "Rahu", "Ketu"]]
    
    if benefics:
        score += 1
        reasons.append(f"Benefic planets ({', '.join(benefics)}) are present in the target house, bringing grace and ease.")
    if malefics:
        score -= 1
        reasons.append(f"Malefic planets ({', '.join(malefics)}) are present in the target house, indicating obstacles or delays.")
        
    # Rule 5: Moon's condition (The mind / fast-moving events)
    moon_house = -1
    for h in range(1, 13):
        if "Moon" in [p["name"] for p in houses.get(h, {}).get("planets", [])]:
            moon_house = h
            break
            
    if moon_house in [6, 8, 12]:
        score -= 1
        reasons.append(f"The Moon is in the {moon_house}th house (a Dusthana/difficult house), showing anxiety or hidden challenges.")
    elif moon_house in [1, 4, 7, 10]:
        score += 1
        reasons.append("The Moon is in a Kendra (Angular) house, showing fast-moving and visible developments.")

    reasoning_text = " ".join(reasons) if reasons else "There are no major positive or negative applying connections right now. It is a neutral or delayed outcome."
    
    return lagna_sign, lagna_lord, target_lord, score, reasoning_text

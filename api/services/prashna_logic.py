from charts.rashi_chart import build_rashi_chart

LORDSHIPS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury",
    "Cancer": "Moon", "Leo": "Sun", "Virgo": "Mercury",
    "Libra": "Venus", "Scorpio": "Mars", "Sagittarius": "Jupiter",
    "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

def get_lord(sign_name: str) -> str:
    return LORDSHIPS.get(sign_name, "Unknown")

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
    else:
        # Rule 2: Conjunction
        if lagna_lord_house == target_lord_house and lagna_lord_house != -1:
            score += 2
            reasons.append(f"The querent's ruler ({lagna_lord}) and the quesited ruler ({target_lord}) are conjunct in house {lagna_lord_house}, forming a strong Ithasala Yoga (Connection).")
            
        # Rule 3: Mutual Reception or Placement
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

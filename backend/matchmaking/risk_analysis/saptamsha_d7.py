from typing import Dict, Any

SIGN_LORDS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

# Friendship logic mapping
FRIENDS = {
    "Sun": ["Moon", "Mars", "Jupiter"],
    "Moon": ["Sun", "Mercury"],
    "Mars": ["Sun", "Moon", "Jupiter"],
    "Mercury": ["Sun", "Venus"],
    "Jupiter": ["Sun", "Moon", "Mars"],
    "Venus": ["Mercury", "Saturn"],
    "Saturn": ["Mercury", "Venus"]
}

ENEMIES = {
    "Sun": ["Venus", "Saturn"],
    "Moon": [],
    "Mars": ["Mercury"],
    "Mercury": ["Moon"],
    "Jupiter": ["Mercury", "Venus"],
    "Venus": ["Sun", "Moon"],
    "Saturn": ["Sun", "Moon", "Mars"]
}

def analyze_saptamsha_d7(bride_data: Dict[str, Any], groom_data: Dict[str, Any]) -> Dict[str, Any]:
    b_d7 = bride_data.get("vargas", {}).get("d7", {})
    g_d7 = groom_data.get("vargas", {}).get("d7", {})

    b_asc_sign = b_d7.get("ascendant_sign", "")
    g_asc_sign = g_d7.get("ascendant_sign", "")
    
    def get_lord(chart: Dict[str, Any], house: int) -> str:
        houses = chart.get("houses", {})
        h_data = houses.get(house) or houses.get(str(house)) or {}
        sign = h_data.get("sign_name", "")
        return SIGN_LORDS.get(sign, "")

    b_asc_lord = get_lord(b_d7, 1)
    g_asc_lord = get_lord(g_d7, 1)
    
    b_5th_lord = get_lord(b_d7, 5)
    g_5th_lord = get_lord(g_d7, 5)

    res = {
        "score": 50,
        "status": "Unknown",
        "description": "Insufficient D-7 data to calculate Saptamsha compatibility.",
        "bride": {"asc_lord": b_asc_lord, "5th_lord": b_5th_lord},
        "groom": {"asc_lord": g_asc_lord, "5th_lord": g_5th_lord}
    }

    if not b_asc_lord or not g_asc_lord or not b_5th_lord or not g_5th_lord:
        return res

    score = 50
    
    # 1. D-7 Ascendant Lords Compatibility (General connection with children)
    if b_asc_lord in FRIENDS.get(g_asc_lord, []) or g_asc_lord in FRIENDS.get(b_asc_lord, []):
        score += 20
    elif b_asc_lord in ENEMIES.get(g_asc_lord, []) or g_asc_lord in ENEMIES.get(b_asc_lord, []):
        score -= 20
        
    # 2. D-7 5th Lords Compatibility (Specific karmic bond regarding parenting)
    if b_5th_lord in FRIENDS.get(g_5th_lord, []) or g_5th_lord in FRIENDS.get(b_5th_lord, []):
        score += 20
    elif b_5th_lord in ENEMIES.get(g_5th_lord, []) or g_5th_lord in ENEMIES.get(b_5th_lord, []):
        score -= 20
        
    # 3. Cross check Ascendant and 5th Lord
    if b_asc_lord in FRIENDS.get(g_5th_lord, []) and g_asc_lord in FRIENDS.get(b_5th_lord, []):
        score += 10
    elif b_asc_lord in ENEMIES.get(g_5th_lord, []) and g_asc_lord in ENEMIES.get(b_5th_lord, []):
        score -= 10
        
    score = max(0, min(100, score))
    res["score"] = score

    if score >= 80:
        res["status"] = "Harmonious Parenting"
        res["description"] = "Excellent D-7 Saptamsha compatibility! You both will share similar philosophies regarding raising children. Your karmic connection to progeny is aligned, promising a nurturing, conflict-free environment for your offspring."
    elif score >= 60:
        res["status"] = "Supportive Parenting"
        res["description"] = "Good D-7 compatibility. You will generally agree on child-rearing and share a positive, supportive bond with your future children."
    elif score >= 40:
        res["status"] = "Neutral Karma"
        res["description"] = "Average D-7 alignment. While you may have different approaches to parenting, it won't cause major friction if you communicate openly."
    else:
        res["status"] = "Karmic Friction"
        res["description"] = "Warning: Your D-7 Ascendant and 5th Lords are hostile. This indicates deep-seated disagreements over parenting styles, or karmic friction regarding children. Conscious effort and compromise will be required to maintain harmony."

    return res

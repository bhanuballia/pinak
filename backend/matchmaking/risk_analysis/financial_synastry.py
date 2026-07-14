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

def analyze_financial_synastry(bride_data: Dict[str, Any], groom_data: Dict[str, Any]) -> Dict[str, Any]:
    b_chart = bride_data.get("chart", {})
    g_chart = groom_data.get("chart", {})

    def get_lord(chart: Dict[str, Any], house: int) -> str:
        houses = chart.get("houses", {})
        h_data = houses.get(house) or houses.get(str(house)) or {}
        sign = h_data.get("sign_name", "")
        return SIGN_LORDS.get(sign, "")

    b_2nd_lord = get_lord(b_chart, 2)
    b_11th_lord = get_lord(b_chart, 11)
    g_2nd_lord = get_lord(g_chart, 2)
    g_11th_lord = get_lord(g_chart, 11)

    if not b_2nd_lord or not g_2nd_lord or not b_11th_lord or not g_11th_lord:
        return {
            "score": 50,
            "status": "Unknown",
            "description": "Insufficient data to calculate Financial Synastry.",
            "bride": {"lord_2nd": "", "lord_11th": ""},
            "groom": {"lord_2nd": "", "lord_11th": ""}
        }

    score = 50
    status = "Neutral Wealth"
    
    # 2nd Lord to 2nd Lord relationship (Saved Wealth)
    if b_2nd_lord in FRIENDS.get(g_2nd_lord, []) or g_2nd_lord in FRIENDS.get(b_2nd_lord, []):
        score += 15
    elif b_2nd_lord in ENEMIES.get(g_2nd_lord, []) or g_2nd_lord in ENEMIES.get(b_2nd_lord, []):
        score -= 15
        
    # 11th Lord to 11th Lord relationship (Income / Gains)
    if b_11th_lord in FRIENDS.get(g_11th_lord, []) or g_11th_lord in FRIENDS.get(b_11th_lord, []):
        score += 15
    elif b_11th_lord in ENEMIES.get(g_11th_lord, []) or g_11th_lord in ENEMIES.get(b_11th_lord, []):
        score -= 15
        
    # 2nd to 11th cross relationship
    if b_2nd_lord in FRIENDS.get(g_11th_lord, []) and g_2nd_lord in FRIENDS.get(b_11th_lord, []):
        score += 20
    elif b_2nd_lord in ENEMIES.get(g_11th_lord, []) and g_2nd_lord in ENEMIES.get(b_11th_lord, []):
        score -= 20
        
    # Bounds check
    score = max(0, min(100, score))

    if score >= 80:
        status = "Wealth Multipliers"
        description = "Exceptional Dhana Yoga Synastry! Your 2nd and 11th lords are highly aligned. This indicates that your union will naturally multiply wealth, increase joint assets, and foster shared financial goals without friction."
    elif score >= 60:
        status = "Financially Favorable"
        description = "Good financial alignment. You generally agree on how to earn and spend money, leading to a stable and supportive economic environment in the relationship."
    elif score >= 40:
        status = "Neutral Wealth"
        description = "Average financial synastry. There are no major wealth curses, but you may occasionally need to compromise on spending habits and long-term financial planning."
    else:
        status = "Wealth Drain Risk"
        description = "Warning: The 2nd and 11th lords are hostile towards each other. This often results in a 'wealth drain' effect where one partner's financial decisions or karmic debts may deplete the other's resources. Strict financial boundaries are recommended."

    return {
        "score": score,
        "status": status,
        "description": description,
        "bride": {
            "lord_2nd": b_2nd_lord,
            "lord_11th": b_11th_lord
        },
        "groom": {
            "lord_2nd": g_2nd_lord,
            "lord_11th": g_11th_lord
        }
    }

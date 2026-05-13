
SIGN_LORDS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

def detect_dhan_yogas(chart, planet_positions):
    """
    Detects classical wealth-producing yogas (Dhan Yogas) in the chart.
    """
    yogas = []
    
    # Extract house lords
    house_lords = {}
    for h_num, h_data in chart.get("houses", {}).items():
        sign = h_data.get("sign_name")
        house_lords[int(h_num)] = SIGN_LORDS.get(sign)
    
    def get_planet_house(p_name):
        if not p_name: return None
        for p in planet_positions:
            if p.get("planet") == p_name:
                return p.get("house")
        return None

    lord_2 = house_lords.get(2)
    lord_11 = house_lords.get(11)
    
    h_lord_2 = get_planet_house(lord_2)
    h_lord_11 = get_planet_house(lord_11)

    # 2nd + 11th connection
    if h_lord_2 == 11 or h_lord_11 == 2:
        yogas.append({
            "name": "Dhan Yoga", 
            "strength": 80, 
            "description": f"Significant connection between {lord_2} (2nd Lord) and {lord_11} (11th Lord), indicating strong wealth potential."
        })

    # 5th + 9th
    lord_5 = house_lords.get(5)
    lord_9 = house_lords.get(9)
    
    h_lord_5 = get_planet_house(lord_5)
    h_lord_9 = get_planet_house(lord_9)

    if h_lord_5 == 9 or h_lord_9 == 5:
        yogas.append({
            "name": "Lakshmi Yoga", 
            "strength": 85, 
            "description": f"Propitious connection between {lord_5} (5th Lord) and {lord_9} (9th Lord), suggesting divine grace and sudden gains."
        })

    # Additional connections: 1st + 2nd, 1st + 11th
    lord_1 = house_lords.get(1)
    h_lord_1 = get_planet_house(lord_1)
    
    if h_lord_1 == 2 or h_lord_1 == 11:
        yogas.append({
            "name": "Self-Made Wealth",
            "strength": 75,
            "description": "Lagna Lord connected to wealth houses, indicating success through personal effort."
        })

    return yogas

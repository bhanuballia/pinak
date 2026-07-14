# matchmaking/risk_analysis/dharma_romance.py
from typing import Dict, Any

ZODIAC_LORDS = {
    "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
    "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
    "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
}

# Standard Vedic Natural Enmity
ENEMIES = {
    "Sun": ["Saturn", "Venus"],
    "Moon": [], # Moon has no natural enemies
    "Mars": ["Mercury"],
    "Mercury": ["Moon"],
    "Jupiter": ["Mercury", "Venus"],
    "Venus": ["Sun", "Moon"],
    "Saturn": ["Sun", "Moon", "Mars"]
}

def _get_house_lord(house_num: str, chart: Dict[str, Any]) -> str:
    h_data = chart.get("houses", {}).get(house_num)
    if isinstance(h_data, dict):
        sign = h_data.get("sign", "")
        return ZODIAC_LORDS.get(sign, "")
    return ""

def _are_enemies(lord1: str, lord2: str) -> bool:
    if not lord1 or not lord2: return False
    l1_enemies = ENEMIES.get(lord1, [])
    l2_enemies = ENEMIES.get(lord2, [])
    # If they are mutual enemies or at least one considers the other an enemy
    return (lord2 in l1_enemies) or (lord1 in l2_enemies)

def analyze_dharma_romance(bride_chart: Dict[str, Any], groom_chart: Dict[str, Any]) -> Dict[str, Any]:
    b_5th = _get_house_lord("5", bride_chart)
    g_5th = _get_house_lord("5", groom_chart)
    
    b_9th = _get_house_lord("9", bride_chart)
    g_9th = _get_house_lord("9", groom_chart)
    
    score = 100
    desc = []
    
    # 5th House (Romance, Intelligence, Children)
    if _are_enemies(b_5th, g_5th):
        score -= 25
        desc.append(f"5th Lords Clash ({b_5th} vs {g_5th}): There may be fundamental disagreements regarding romance, creative expression, and parenting styles. Their ideas of 'fun' and 'love' differ.")
    elif b_5th == g_5th and b_5th:
        desc.append(f"Shared 5th Lord ({b_5th}): Excellent harmony in romantic expression and mutual creativity.")
    else:
        desc.append(f"Neutral/Friendly 5th Lords ({b_5th} and {g_5th}): Good romantic and creative compatibility.")
        
    # 9th House (Dharma, Beliefs, Life Philosophy)
    if _are_enemies(b_9th, g_9th):
        score -= 40
        desc.append(f"9th Lords Clash ({b_9th} vs {g_9th}): Major warning. Their core life philosophies, religious views, morals, or ethical boundaries conflict. This can slowly erode the marriage from the inside out due to fundamental ideological disagreements.")
    elif b_9th == g_9th and b_9th:
        desc.append(f"Shared 9th Lord ({b_9th}): Perfect alignment in Dharma. They share the same life path, moral compass, and spiritual beliefs.")
    else:
        desc.append(f"Neutral/Friendly 9th Lords ({b_9th} and {g_9th}): Harmonious alignment of life goals and belief systems.")
        
    status = "Harmonious"
    if score >= 90:
        status = "Perfect Alignment"
    elif score >= 60:
        status = "Average"
    elif score < 60:
        status = "Ideological Clash"
        
    return {
        "score": score,
        "status": status,
        "description": " ".join(desc),
        "bride": {
            "5th_lord": b_5th,
            "9th_lord": b_9th
        },
        "groom": {
            "5th_lord": g_5th,
            "9th_lord": g_9th
        }
    }

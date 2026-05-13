
def calculate_wealth_score(chart, p_strengths, yogas):
    """
    Calculates a numeric wealth score based on house strengths, planet dignities, and yogas.
    """
    score = 50
    
    from core.wealth.dhan_yoga_engine import SIGN_LORDS
    
    def get_str(p):
        raw = p_strengths.get(p, {}).get("total", 0)
        return min(100, raw / 6.0) if raw > 100 else raw

    # 2nd house lord strength (Accumulated Wealth)
    h2_sign = chart.get("houses", {}).get(2, {}).get("sign_name")
    lord_2 = SIGN_LORDS.get(h2_sign)
    score += get_str(lord_2) * 0.2

    # 11th house lord strength (Incoming Gains)
    h11_sign = chart.get("houses", {}).get(11, {}).get("sign_name")
    lord_11 = SIGN_LORDS.get(h11_sign)
    score += get_str(lord_11) * 0.2

    # Natural Wealth Significators: Jupiter (Wealth/Expansion) & Venus (Luxury/Assets)
    score += get_str("Jupiter") * 0.15
    score += get_str("Venus") * 0.15

    # Yogas bonus
    for y in yogas:
        score += y.get("strength", 0) * 0.1

    return int(max(0, min(score, 100)))

# astrology/scoring.py

def calculate_risk_score(saturn_strength, moon_weakness, dasha_overlap=False, transit_overlap=False):
    """
    Calculates a risk score from 0-100 based on various factors.
    """
    # Normalized strengths (assuming 0-40 range for each component)
    score = saturn_strength + moon_weakness
    
    if dasha_overlap:
        score += 20
    if transit_overlap:
        score += 30
        
    return min(100, score)

def get_risk_interpretation(score):
    if score <= 25: return "Mild"
    if score <= 50: return "Moderate"
    if score <= 75: return "Strong"
    return "Intense"

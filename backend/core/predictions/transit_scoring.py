# core/predictions/transit_scoring.py

def transit_score_year(year, chart):

    score = 0

    # Simple PRO model (you can later connect Swiss Ephemeris)

    if year % 2 == 0:
        score += 2  # Jupiter positive phase

    if year % 3 == 0:
        score -= 2  # Saturn pressure phase

    return score

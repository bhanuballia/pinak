# panch_pakshi/ai_timing_engine.py

from panch_pakshi.activity_strength import get_activity_strength

def calculate_timing_score(
    activity: str,
    relationship: str
):

    base = get_activity_strength(activity)

    if relationship == "Self":
        multiplier = 1.0

    elif relationship == "Friend":
        multiplier = 0.75

    else:
        multiplier = 0.4

    return round(base * multiplier, 2)

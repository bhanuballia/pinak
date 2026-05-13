
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

"""
ASTROCONSULT — LIFE EVENT PEAK DETECTOR ULTRA
Detects important astrology timeline peaks.
"""


# ----------------------------------------------------------
# MAIN EVENT DETECTOR
# ----------------------------------------------------------
def detect_life_events(yearly_predictions, probability_matrix, dosha, strength):

    events = []

    career_base = probability_matrix.get("career_growth", 60)
    wealth_base = probability_matrix.get("wealth_index", 60)
    marriage_base = probability_matrix.get("marriage_probability", 60)

    avg_strength = _get_strength(strength, "average", 60)

    for item in yearly_predictions:

        year = item["year"]
        risk = item.get("risk_level", "medium")
        focus = item.get("focus", "")

        # ---------------------------------
        # CAREER PEAK
        # ---------------------------------
        if career_base > 70 and risk != "high":
            events.append({
                "year": year,
                "type": "career_peak",
                "label": "Career Rise"
            })

        # ---------------------------------
        # WEALTH SURGE
        # ---------------------------------
        if wealth_base > 75:
            events.append({
                "year": year,
                "type": "wealth_peak",
                "label": "Financial Growth"
            })

        # ---------------------------------
        # MARRIAGE WINDOW
        # ---------------------------------
        if marriage_base > 65 and "relationship" in focus.lower():
            events.append({
                "year": year,
                "type": "relationship_window",
                "label": "Relationship Window"
            })

        # ---------------------------------
        # RISK PERIOD (DOSHA ACTIVE)
        # ---------------------------------
        if dosha.get("sadesati", {}).get("present") or risk == "high":
            events.append({
                "year": year,
                "type": "risk_period",
                "label": "Challenging Phase"
            })

        # ---------------------------------
        # SPIRITUAL PHASE
        # ---------------------------------
        if avg_strength < 50:
            events.append({
                "year": year,
                "type": "spiritual_shift",
                "label": "Inner Transformation"
            })

    return events

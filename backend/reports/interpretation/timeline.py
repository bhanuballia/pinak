# reports/interpretation/timeline.py

from datetime import datetime
from .transit_rules import jupiter_transit_effect, saturn_transit_effect

START_YEAR = 2025
END_YEAR = 2035


def generate_timeline_predictions(chart, dasha, dosha, strength):
    timeline = {}

    for year in range(START_YEAR, END_YEAR + 1):
        timeline[str(year)] = yearly_prediction(
            year, chart, dasha, dosha, strength
        )

    return timeline

def yearly_prediction(year, chart, dasha, dosha, strength):
    current_dasha = dasha["current"]        
    next_dasha = dasha["next"]

    # Jupiter transit effect
    jupiter_effect = jupiter_transit_effect(chart, year)

    # Saturn transit effect
    saturn_effect = saturn_transit_effect(chart, year)

    # Dasha period effect
    dasha_effect = dasha_period_effect(current_dasha, next_dasha, year)

    # Combine effects
    prediction = {
        "jupiter": jupiter_effect,
        "saturn": saturn_effect,
        "dasha": dasha_effect,
        "summary": f"{jupiter_effect} {saturn_effect} {dasha_effect}"
    }
        
    return prediction

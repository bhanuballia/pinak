from core.destiny_matrix.event_detector import detect_life_events
from core.destiny_matrix.probability_engine import calculate_event_probability
from core.destiny_matrix.risk_engine import detect_risk


def build_year_matrix(year, ctx):

    events = detect_life_events(year, ctx)

    probability = calculate_event_probability(events, ctx.get("dosha", {}))

    risk = detect_risk(year, ctx)

    return {
        "year": year,
        "events": events,
        "probability": probability,
        "risk": risk
    }

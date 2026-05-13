from core.omniscient_timeline.marriage_engine import marriage_window
from core.omniscient_timeline.career_engine import career_window
from core.omniscient_timeline.finance_engine import finance_window
from core.omniscient_timeline.health_engine import health_risk
from core.omniscient_timeline.transit_engine import get_major_transits


def build_year_events(year, ctx):

    events = []

    dasha = ctx["dasha"]
    strength = ctx["strength"]
    dosha = ctx["dosha"]
    chart = ctx["chart"]

    # find active lord
    lord = dasha["current"]["lord"]
    for p in dasha.get("list", []):
        if int(p["start_date"][:4]) <= year <= int(p["end_date"][:4]):
            lord = p["lord"]

    transits = get_major_transits(year, chart)

    for e in [
        marriage_window(year, lord, strength),
        career_window(year, lord, transits),
        finance_window(lord, strength),
        health_risk(dosha)
    ]:
        if e:
            events.append(e)

    return {
        "year": year,
        "lord": lord,
        "events": events
    }

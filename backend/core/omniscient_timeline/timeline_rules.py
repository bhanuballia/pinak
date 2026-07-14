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
        try:
            start_yr = int(p["start_date"].split("/")[-1]) if "/" in p["start_date"] else int(p["start_date"][:4])
            end_yr = int(p["end_date"].split("/")[-1]) if "/" in p["end_date"] else int(p["end_date"][:4])
            if start_yr <= year <= end_yr:
                lord = p["lord"]
        except (ValueError, KeyError, TypeError):
            continue

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


def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def detect_life_events(year, ctx):

    events = []

    dasha = ctx.get("dasha", {})
    strength = ctx.get("strength", {})

    lord = None
    for p in dasha.get("list", []):
        try:
            start_yr = int(p["start_date"].split("/")[-1]) if "/" in p["start_date"] else int(p["start_date"][:4])
            end_yr = int(p["end_date"].split("/")[-1]) if "/" in p["end_date"] else int(p["end_date"][:4])
            if start_yr <= year <= end_yr:
                lord = p["lord"]
        except (ValueError, KeyError, TypeError):
            continue

    if lord == "Jupiter":
        events.append("career_growth")

    if lord == "Venus":
        events.append("relationship_focus")

    if lord == "Saturn":
        events.append("responsibility_phase")

    if _get_strength(strength, "Mars", 0) > 1.2:
        events.append("high_action_period")

    return events


def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def detect_life_events(chart, dasha, strength):

    events = []

    venus = _get_strength(strength, "Venus", 50)
    jupiter = _get_strength(strength, "Jupiter", 50)
    saturn = _get_strength(strength, "Saturn", 50)

    for p in dasha.get("list",[]):

        lord = p["lord"]

        # Marriage windows
        if lord in ["Venus","Moon","Jupiter"] and venus > 55:
            events.append({
                "type":"Marriage Potential",
                "start":p["start_date"],
                "end":p["end_date"]
            })

        # Career rise
        if lord in ["Saturn","Sun","Mars"] and saturn > 50:
            events.append({
                "type":"Career Rise",
                "start":p["start_date"],
                "end":p["end_date"]
            })

        # Wealth phase
        if lord in ["Jupiter","Venus"]:
            events.append({
                "type":"Financial Growth",
                "start":p["start_date"],
                "end":p["end_date"]
            })

    return events

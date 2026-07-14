
def _get_strength(strength, key, default=1.0):
    if isinstance(strength, dict) and "planets" in strength:
        val = strength["planets"].get(key)
        if isinstance(val, dict):
            return val.get("total_score", default)
        return val if val is not None else default
    elif isinstance(strength, dict):
        return strength.get(key, default)
    return default

def marriage_windows(chart, dasha, strength):

    results = []

    venus_strength = _get_strength(strength, "Venus", 50)
    jupiter_strength = _get_strength(strength, "Jupiter", 50)

    for period in dasha.get("list",[]):

        lord = period.get("lord")

        if lord in ["Venus","Jupiter","Moon"]:

            score = (venus_strength + jupiter_strength) / 2

            if score > 60:

                results.append({
                    "start": period["start_date"],
                    "end": period["end_date"],
                    "confidence": "High",
                    "note": "Strong marriage potential window"
                })

    return results

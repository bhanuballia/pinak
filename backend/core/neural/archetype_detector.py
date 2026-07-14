def detect_archetype(report_data, signals):

    asc = report_data.get("basic_details", {}).get("ascendant", "")
    dominant = signals.get("dominant_planets", [])

    if "Sun" in dominant or asc == "Leo":
        return "Leader Archetype"

    if "Saturn" in dominant:
        return "Strategist Archetype"

    if "Venus" in dominant:
        return "Artist Archetype"

    if "Jupiter" in dominant:
        return "Teacher Archetype"

    return "Explorer Archetype"

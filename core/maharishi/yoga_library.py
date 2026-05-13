def detect_classical_yogas(chart):

    houses = chart.get("houses", {})
    yogas = []

    # Gaja Kesari Yoga
    if "Moon" in houses.get(1, {}).get("planets", []) and \
       "Jupiter" in houses.get(4, {}).get("planets", []):
        yogas.append({
            "name": "Gaja Kesari Yoga",
            "result": "Intelligence, respect, leadership"
        })

    # Raja Yoga example
    if "Sun" in houses.get(10, {}).get("planets", []):
        yogas.append({
            "name": "Raja Yoga",
            "result": "Authority and career rise"
        })

    return yogas

def spiritual_cycles(chart, dasha):

    phases = []

    for p in dasha.get("list",[]):

        if p["lord"] in ["Ketu","Jupiter"]:

            phases.append({
                "start": p["start_date"],
                "end": p["end_date"],
                "confidence": "High" if p["lord"] == "Ketu" else "Medium",
                "note": "Deep karmic unwinding and spiritual awakening" if p["lord"] == "Ketu" else "Period of philosophical growth and wisdom"
            })

    return phases

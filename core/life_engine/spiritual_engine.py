def spiritual_cycles(chart, dasha):

    phases = []

    for p in dasha.get("list",[]):

        if p["lord"] in ["Ketu","Jupiter"]:

            phases.append({
                "start": p["start_date"],
                "end": p["end_date"],
                "type":"Spiritual Growth"
            })

    return phases

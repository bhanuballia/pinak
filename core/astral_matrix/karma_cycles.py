def detect_karma_cycles(chart, dasha):

    cycles = []

    for period in dasha.get("list",[]):

        lord = period["lord"]

        if lord in ["Saturn","Rahu","Ketu"]:
            cycles.append({
                "type":"Karmic Testing",
                "year": period["start_date"].split("/")[-1] if "/" in period["start_date"] else period["start_date"][:4]
            })

        if lord in ["Jupiter"]:
            cycles.append({
                "type":"Expansion Cycle",
                "year": period["start_date"].split("/")[-1] if "/" in period["start_date"] else period["start_date"][:4]
            })

    return cycles

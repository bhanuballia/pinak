def suggest_remedies(report_data):

    dosha = report_data.get("dosha", {})
    remedies = []

    if dosha.get("manglik", {}).get("present"):
        remedies.append("Hanuman Chalisa on Tuesdays")

    if dosha.get("sadesati", {}).get("present"):
        remedies.append("Shani mantra on Saturdays")

    if dosha.get("pitra", {}).get("present"):
        remedies.append("Pitra Tarpan on Amavasya")

    return remedies

def health_cycles(chart, dosha):

    alerts = []

    if dosha.get("sadesati",{}).get("present"):
        alerts.append({
            "type":"Saturn Pressure",
            "note":"Mental stress periods possible"
        })

    if dosha.get("kalsarp",{}).get("present"):
        alerts.append({
            "type":"Karmic Stress",
            "note":"Energy imbalance phases"
        })

    return alerts

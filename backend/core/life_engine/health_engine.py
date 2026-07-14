def health_cycles(chart, dosha):

    alerts = []

    if dosha.get("sadesati",{}).get("present"):
        alerts.append({
            "start": "Ongoing",
            "end": "Check Saturn Transit",
            "confidence": "High",
            "note": "Mental stress periods possible due to Sade Sati"
        })

    if dosha.get("kalsarp",{}).get("present"):
        alerts.append({
            "start": "Birth",
            "end": "Lifelong",
            "confidence": "High",
            "note": "Energy imbalance phases requiring grounding"
        })

    return alerts

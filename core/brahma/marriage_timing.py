def predict_marriage_window(chart, dasha, dosha):

    windows = []

    for period in dasha.get("list", []):
        lord = period.get("lord")

        if lord in ["Venus","Moon","Jupiter"]:
            windows.append({
                "start": period["start_date"],
                "end": period["end_date"],
                "reason": "Marriage-friendly dasha"
            })

    if dosha.get("manglik",{}).get("present"):
        return {
            "status": "Delayed Marriage Possible",
            "windows": windows
        }

    return {
        "status": "Favourable Marriage Periods",
        "windows": windows
    }

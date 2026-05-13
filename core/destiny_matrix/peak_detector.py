def detect_peaks(timeline):

    peaks = []

    for y in timeline:
        if y.get("risk_level") == "low":
            peaks.append({
                "year": y["year"],
                "type": "growth_peak"
            })

    return peaks

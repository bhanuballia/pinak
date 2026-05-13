# core/predictions/fortune_engine.py

def detect_fortune_peaks(timeline):

    peaks = []

    for y in timeline:
        if y["total_score"] >= 5:
            peaks.append({
                "year": y["year"],
                "type": "Fortune Peak"
            })

    return peaks

# core/predictions/marriage_engine.py

def detect_marriage_windows(timeline, chart, dosha):

    results = []

    for y in timeline:

        score = y["total_score"]

        if score >= 3:

            if not dosha.get("manglik", {}).get("present"):
                results.append({
                    "year": y["year"],
                    "probability": "High"
                })
            else:
                results.append({
                    "year": y["year"],
                    "probability": "Moderate"
                })

    return results

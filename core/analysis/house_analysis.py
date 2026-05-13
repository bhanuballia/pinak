# core/analysis/house_analysis.py

def analyze_houses(chart):

    results = {}

    for h, data in chart.get("houses", {}).items():
        planets = data.get("planets", [])

        if len(planets) >= 3:
            results[h] = "Highly activated house."
        elif len(planets) == 0:
            results[h] = "Calm or neutral area of life."
        else:
            results[h] = "Moderate influence."

    return results

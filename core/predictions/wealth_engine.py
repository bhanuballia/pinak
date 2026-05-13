# core/predictions/wealth_engine.py

def detect_wealth_periods(timeline):

    wealth = []

    for y in timeline:

        if y["total_score"] >= 4:

            wealth.append({
                "year": y["year"],
                "trend": "Financial Growth"
            })

    return wealth

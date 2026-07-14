def analyze_marriage(chart, dosha, dasha):

    result = {
        "delay": False,
        "risk": "Low",
        "notes": []
    }

    if dosha.get("manglik", {}).get("present"):
        result["delay"] = True
        result["notes"].append(
            "Manglik influence may delay marriage or create strong passion."
        )

    current_lord = dasha.get("current", {}).get("lord")

    if current_lord == "Saturn":
        result["risk"] = "Moderate"
        result["notes"].append(
            "Saturn dasha requires maturity in relationships."
        )

    return result

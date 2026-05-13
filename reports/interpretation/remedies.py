def recommend_remedies(chart, dosha, dasha):
    remedies = []

    if dosha.get("manglik", {}).get("present"):
        remedies.append({
            "issue": "Manglik Dosha",
            "remedy": "Hanuman Chalisa on Tuesdays",
            "type": "Mantra"
        })

    if dosha.get("kalsarp", {}).get("present"):
        remedies.append({
            "issue": "Kaal Sarp Dosha",
            "remedy": "Rahu–Ketu Shanti Puja",
            "type": "Ritual"
        })

    if dasha["current"]["lord"] == "Saturn":
        remedies.append({
            "issue": "Saturn Dasha",
            "remedy": "Charity on Saturdays",
            "type": "Lifestyle"
        })

    return remedies

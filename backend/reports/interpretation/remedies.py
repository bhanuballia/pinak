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

    current_dasha = dasha.get("current", {}) if isinstance(dasha, dict) else {}
    if current_dasha.get("lord") == "Saturn" or current_dasha.get("planet") == "Saturn":
        remedies.append({
            "issue": "Saturn Dasha",
            "remedy": "Charity on Saturdays",
            "type": "Lifestyle"
        })

    return remedies

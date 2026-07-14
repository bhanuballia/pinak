def smart_remedies(dosha, emotions, personality):

    remedies = []

    if dosha.get("manglik",{}).get("present"):
        remedies.append("Hanuman Chalisa on Tuesdays")

    if dosha.get("kalsarp",{}).get("present"):
        remedies.append("Rahu-Ketu Shanti Mantra")

    if "intense" in emotions.lower():
        remedies.append("Moon meditation and water rituals")

    if personality.get("archetype") == "Visionary":
        remedies.append("Surya Namaskar at sunrise")

    return remedies

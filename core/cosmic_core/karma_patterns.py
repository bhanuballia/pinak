def detect_karma_patterns(chart, dosha):

    patterns = []

    if dosha.get("kalsarp",{}).get("present"):
        patterns.append("Past-life unfinished karmic cycles")

    if dosha.get("pitra",{}).get("present"):
        patterns.append("Ancestral karma influence")

    if dosha.get("mangalik",{}).get("present"):
        patterns.append("Intense relationship karma")

    if not patterns:
        patterns.append("Balanced karmic flow")

    return patterns

def calculate_karma_index(report_data):

    dosha = report_data.get("dosha", {})

    score = 100

    if dosha.get("kalsarp", {}).get("present"):
        score -= 15

    if dosha.get("pitra", {}).get("present"):
        score -= 10

    if dosha.get("manglik", {}).get("present"):
        score -= 8

    return max(score, 20)

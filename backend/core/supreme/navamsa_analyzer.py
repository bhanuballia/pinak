def analyze_navamsa(d9):

    score = 0

    if not d9:
        return {"marriage_strength": "Unknown"}

    planets = d9.get("planets", {})

    if planets.get("Venus", {}).get("house") in [1,5,7]:
        score += 2

    if planets.get("Jupiter", {}).get("house") in [1,9]:
        score += 2

    if score >= 3:
        level = "Very Strong"
    elif score == 2:
        level = "Strong"
    else:
        level = "Average"

    return {
        "navamsa_score": score,
        "marriage_strength": level
    }

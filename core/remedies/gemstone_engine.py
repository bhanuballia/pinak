from core.remedies.gemstone_database import GEMSTONE_MAP
from core.remedies.gemstone_rules import benefic_planets


def recommend_gemstones(chart, strength, dasha):
    # chart["ascendant_sign"] is the correct key returned by build_rashi_chart
    lagna = chart.get("ascendant_sign") or chart.get("ascendant", {}).get("sign", "Aries")

    benefics = benefic_planets(lagna)

    recommendations = []

    # 1 Lagna support gemstones
    for planet in benefics:

        if planet in GEMSTONE_MAP:

            recommendations.append({
                "planet": planet,
                "details": GEMSTONE_MAP[planet],
                "reason": "Benefic planet for your Ascendant"
            })

    # 2 Current Dasha gemstone
    try:
        dasha_lord = dasha["current"]["lord"]
        if dasha_lord in GEMSTONE_MAP:
            recommendations.append({
                "planet": dasha_lord,
                "details": GEMSTONE_MAP[dasha_lord],
                "reason": "Strengthening current Mahadasha lord"
            })
    except (KeyError, TypeError):
        pass

    # 3 Weak planet strengthening
    # strength may be a nested dict: {"planets": {planet: {"total_score": ...}}, ...}
    # or a flat dict: {planet: score}
    try:
        planet_scores = {}
        if "planets" in strength and isinstance(strength["planets"], dict):
            # Nested structure from compute_shadbala_new
            for planet, data in strength["planets"].items():
                if isinstance(data, dict):
                    planet_scores[planet] = data.get("total_score", 60)
                else:
                    planet_scores[planet] = float(data)
        else:
            # Flat structure: {planet: score}
            for planet, score in strength.items():
                if isinstance(score, (int, float)):
                    planet_scores[planet] = score

        for planet, score in planet_scores.items():
            if score < 40 and planet in GEMSTONE_MAP:
                recommendations.append({
                    "planet": planet,
                    "details": GEMSTONE_MAP[planet],
                    "reason": "Planet weak in chart"
                })
    except Exception:
        pass

    return recommendations
def answer(question, chart, dasha, dosha, transits):
    seventh_house = chart["houses"][7]
    venus_strength = chart["planets"]["Venus"]["strength"]

    if venus_strength > 70:
        return (
            "Marriage prospects are strong. Favorable Venus influence "
            "supports harmony and emotional bonding."
        )

    if dosha.get("manglik", {}).get("present"):
        return (
            "Manglik Dosha indicates delay or intensity in marriage matters. "
            "Proper matching and remedies are advised."
        )

    return (
        "Marriage is possible after some delay. Emotional maturity and "
        "family alignment will play a key role."
    )

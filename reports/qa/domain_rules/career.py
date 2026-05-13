def answer(question, chart, dasha, dosha, transits):
    tenth_house = chart["houses"][10]
    lord = tenth_house["lord"]
    active_dasha = dasha["current"]["lord"]

    positive = lord in ["Sun", "Saturn", "Jupiter"] and active_dasha == lord

    if positive:
        return (
            "Your career shows improvement during the ongoing "
            f"{active_dasha} period. Strong planetary support indicates "
            "recognition, responsibility, and gradual rise."
        )

    if dosha.get("kalsarp", {}).get("present"):
        return (
            "Career progress may feel delayed due to Kaal Sarp influence. "
            "Results will come after sustained effort and patience."
        )

    return (
        "Career growth is moderate at present. Strengthening skills and "
        "waiting for favorable dasha will improve prospects."
    )

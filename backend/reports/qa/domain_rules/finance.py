def answer(question, chart, dasha, dosha, transits):
    second = chart["houses"][2]
    eleventh = chart["houses"][11]

    if second["lord"] == eleventh["lord"]:
        return (
            "Strong wealth yoga is present. Income stability and accumulation "
            "increase over time."
        )

    return (
        "Finances require disciplined planning. Avoid risky speculation "
        "during weak planetary periods."
    )

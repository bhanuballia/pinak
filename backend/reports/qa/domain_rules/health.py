def answer(question, chart, dasha, dosha, transits):
    sixth = chart["houses"][6]

    if sixth["afflicted"]:
        return (
            "Health needs attention. Maintain routine, diet, and stress control. "
            "Preventive care is advised."
        )

    return (
        "Overall health remains stable. Continue balanced lifestyle "
        "and regular physical activity."
    )

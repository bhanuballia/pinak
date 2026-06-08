# ai/gpt_interpretation_engine.py

class GPTInterpretationEngine:

    def generate_report(
        self,
        chart_data
    ):

        planets = chart_data.get(
            "planets",
            []
        )

        interpretation = []

        for p in planets:

            interpretation.append(

                f"{p['name']} in "
                f"{p['sign']} indicates "
                f"karmic activation related "
                f"to {p['house']} house matters."
            )

        return "\n".join(
            interpretation
        )

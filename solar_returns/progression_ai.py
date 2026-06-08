# solar_returns/progression_ai.py

class ProgressionAI:
    """
    AI interpretation system.
    """

    def interpret(
        self,
        chart
    ):
        if chart.get("career_score", 0) > 75:
            return (
                "Strong professional growth indicated."
            )

        return (
            "Balanced monthly progression."
        )

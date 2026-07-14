# ai/event_probability_ai.py

class EventProbabilityAI:

    def calculate_probability(
        self,
        dasha_score,
        transit_score,
        divisional_support
    ):

        total = (
            dasha_score * 0.4
            +
            transit_score * 0.3
            +
            divisional_support * 0.3
        )

        return {

            "probability":
                round(total, 2),

            "status":
                (
                    "HIGH"
                    if total > 75
                    else "MEDIUM"
                )
        }

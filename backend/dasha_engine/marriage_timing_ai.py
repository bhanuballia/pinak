class MarriageTimingAI:

    def predict(
        self,
        seventh_house_score,
        venus_strength,
        d9_strength,
        dasha_support,
        transit_support
    ):

        probability = (
            seventh_house_score * 0.25 +
            venus_strength * 0.25 +
            d9_strength * 0.20 +
            dasha_support * 0.15 +
            transit_support * 0.15
        )

        if probability >= 75:
            timing = "Strong marriage period"

        elif probability >= 55:
            timing = "Moderate marriage possibility"

        else:
            timing = "Weak marriage timing"

        return {
            "probability": round(probability, 2),
            "result": timing
        }

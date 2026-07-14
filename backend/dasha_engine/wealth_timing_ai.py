class WealthTimingAI:

    def predict(
        self,
        second_house,
        eleventh_house,
        jupiter_strength,
        dasha_support
    ):

        score = (
            second_house * 0.30 +
            eleventh_house * 0.30 +
            jupiter_strength * 0.20 +
            dasha_support * 0.20
        )

        return {
            "wealth_probability": round(score, 2),
            "wealth_period": score > 70
        }

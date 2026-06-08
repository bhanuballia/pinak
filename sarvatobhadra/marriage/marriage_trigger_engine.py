class MarriageTriggerEngine:

    def evaluate(
        self,
        venus_strength,
        jupiter_transit
    ):

        score = (
            venus_strength * 0.6
            + jupiter_transit * 0.4
        )

        return {
            "marriage_probability": score
        }

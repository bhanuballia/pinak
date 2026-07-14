class CareerAIProbability:
    """
    Master AI scoring engine.
    Aggregates strength, transits, dashas, and yogas into a single success probability.
    """
    def evaluate(
        self,
        d10_strength,
        transit_score,
        dasha_score,
        yoga_score
    ):
        total = (
            d10_strength * 0.3 +
            transit_score * 0.25 +
            dasha_score * 0.25 +
            yoga_score * 0.2
        )

        return {
            "career_probability": round(total, 2)
        }

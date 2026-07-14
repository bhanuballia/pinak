class AIProbabilityEngine:

    def calculate_probability(
        self,
        dasha_score,
        transit_score,
        varga_strength,
        affliction
    ):

        score = (
            dasha_score * 0.4 +
            transit_score * 0.3 +
            varga_strength * 0.3
        )

        score -= affliction

        return max(min(round(score, 2), 100), 0)

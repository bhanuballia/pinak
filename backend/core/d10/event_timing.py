class D10EventTiming:
    """
    Professional event timing engine.
    Calculates key windows based on transit, dasha, and chart strength.
    """
    def predict(
        self,
        transit_score,
        dasha_score,
        d10_strength
    ):
        total = (
            transit_score +
            dasha_score +
            d10_strength
        ) / 3

        if total >= 80:
            return "Major Career Event"
        elif total >= 60:
            return "Promotion Window"
        elif total >= 40:
            return "Career Movement"

        return "Stable Period"

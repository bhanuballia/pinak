class D10TransitActivation:
    """
    Detects career activation through transits.
    Specifically looks for Jupiter and Saturn activating the 10th house.
    """
    def evaluate(
        self,
        transit_planets,
        d10_chart
    ):
        score = 0
        jupiter_house = transit_planets.get("Jupiter")
        saturn_house = transit_planets.get("Saturn")

        # Jupiter activating 10th
        if jupiter_house == 10:
            score += 35

        # Saturn activating karma
        if saturn_house == 10:
            score += 25

        return {
            "activation_score": min(score, 100),
            "active": score >= 40
        }

class WealthActivation:
    """
    Detects wealth activation periods based on Jupiter/Venus transits 
    and 2nd house strength.
    """
    def evaluate(
        self,
        jupiter_active,
        venus_active,
        second_house_score
    ):
        score = 0
        if jupiter_active:
            score += 40
        if venus_active:
            score += 30

        score += second_house_score

        return {
            "wealth_score": min(score, 100)
        }

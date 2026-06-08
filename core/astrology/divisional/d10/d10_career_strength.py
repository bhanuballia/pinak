class D10CareerStrength:
    """
    Career strength analysis
    based on D10 placements.
    """

    def evaluate(
        self,
        planet,
        dignity_score,
        house
    ):
        score = dignity_score

        # Kendra houses
        if house in [1, 4, 7, 10]:
            score += 10

        # Trikona
        if house in [1, 5, 9]:
            score += 8

        # Dusthana
        if house in [6, 8, 12]:
            score -= 8

        return max(
            0,
            min(score, 100)
        )

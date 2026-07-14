class D10DashaSync:
    """
    Synchronizes D10 placements with Vimshottari Dasha cycles.
    Prioritizes Sun, Saturn, Mercury, Jupiter, and Mars for career activation.
    """
    CAREER_PLANETS = [
        "Sun",
        "Saturn",
        "Mercury",
        "Jupiter",
        "Mars"
    ]

    def evaluate(
        self,
        mahadasha,
        antardasha
    ):
        score = 0
        if mahadasha in self.CAREER_PLANETS:
            score += 40
        if antardasha in self.CAREER_PLANETS:
            score += 25

        return {
            "career_dasha": score >= 50,
            "score": score
        }

class ForeignCareerIndicators:
    """
    Detects foreign career combinations through Rahu and 12H strength.
    """
    def detect(
        self,
        rahu_house,
        twelfth_house_score
    ):
        if (
            rahu_house in [9, 12]
            or twelfth_house_score > 70
        ):
            return {
                "foreign_career": True,
                "probability": 82
            }

        return {
            "foreign_career": False
        }

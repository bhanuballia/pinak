class BusinessVsJob:
    """
    Determines whether business or employment suits the native.
    Balances Mars/Rahu (Business) against Saturn/Mercury (Job).
    """
    def evaluate(
        self,
        mars_score,
        saturn_score,
        mercury_score,
        rahu_score
    ):
        business = (
            mars_score +
            mercury_score +
            rahu_score
        )

        job = (
            saturn_score +
            mercury_score
        )

        if business > job:
            return {
                "recommended": "Business",
                "score": business
            }

        return {
            "recommended": "Job",
            "score": job
        }

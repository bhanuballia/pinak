# nakshatra_advanced/compatibility/marriage_ai.py

class MarriageAI:

    def compatibility(
        self,
        boy_nak,
        girl_nak
    ):

        diff = abs(
            boy_nak - girl_nak
        )

        if diff <= 3:

            return {
                "score": 90,
                "status": "Excellent"
            }

        if diff <= 9:

            return {
                "score": 75,
                "status": "Good"
            }

        return {
            "score": 50,
            "status": "Average"
        }

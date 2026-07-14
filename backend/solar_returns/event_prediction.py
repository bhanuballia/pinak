# solar_returns/event_prediction.py

class EventPrediction:
    """
    AI-style event probability engine.
    """

    def predict(
        self,
        activation_score
    ):
        if activation_score > 80:
            return {
                "event":
                    "Major Life Event",
                "probability":
                    "HIGH"
            }

        return {
            "event":
                "Moderate Activity",
            "probability":
                "LOW"
        }

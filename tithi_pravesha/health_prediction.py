# tithi_pravesha/health_prediction.py

class HealthPrediction:

    def analyze(
        self,
        saturn,
        sixth_house
    ):

        risk = (
            saturn
            +
            sixth_house
        ) / 2

        return {

            "health_risk":
                risk

        }

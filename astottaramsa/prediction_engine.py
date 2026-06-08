# astottaramsa/prediction_engine.py

class PredictionEngine:

    def predict(self, score):

        if score > 80:
            return "Major destiny activation"

        if score > 60:
            return "Strong karmic period"

        return "Moderate karmic activation"

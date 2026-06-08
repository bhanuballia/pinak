# jaimini_system/prediction_engine.py

class PredictionEngine:
    def predict(self, active_sign):
        predictions = {
            1: "Career growth",
            7: "Marriage activation",
            10: "Professional success",
            12: "Spiritual phase"
        }
        return predictions.get(active_sign, "General karmic activation")

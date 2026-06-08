# tithi_pravesha/event_prediction.py

class EventPrediction:

    def predict(
        self,
        activation
    ):

        if activation > 80:
            return "Major life event"

        if activation > 60:
            return "Important activation"

        return "Normal yearly cycle"

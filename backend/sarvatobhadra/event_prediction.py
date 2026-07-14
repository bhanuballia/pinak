class EventPrediction:

    def predict(self, activation_score):

        if activation_score > 80:
            return "Major Event Activation"

        return "Normal Transit"

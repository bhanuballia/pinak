# sanghatta_chakra/event_probability.py

class EventProbability:

    def predict(self, score):

        if score > 80:
            return "Critical"

        if score > 60:
            return "High"

        if score > 40:
            return "Moderate"

        return "Low"

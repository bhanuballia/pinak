class NakshatraAI:

    def interpret(self, nakshatra):

        interpretations = {
            "Rohini": "Growth and attraction period",
            "Pushya": "Spiritual and stable period",
            "Mula": "Transformation and karmic reset"
        }

        return interpretations.get(
            nakshatra,
            "General activation"
        )

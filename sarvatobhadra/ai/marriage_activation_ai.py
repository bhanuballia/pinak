class MarriageActivationAI:

    def detect(self, dasha, transit):

        if (
            dasha == "Venus"
            and transit == "Jupiter"
        ):

            return {
                "activation": True,
                "probability": 88
            }

        return {
            "activation": False
        }

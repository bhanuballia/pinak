# astottaramsa/marriage/marriage_activation.py

class MarriageActivation:

    def evaluate(
        self,
        venus_strength,
        jupiter_transit
    ):

        probability = (
            venus_strength * 0.6
            +
            jupiter_transit * 0.4
        )

        return {
            "marriage_probability":
                probability
        }

class D10RajYoga:
    """
    Professional Success Yogas analysis for D10.
    Detects specific combinations like Sun in 10th and Jupiter in 9th.
    """
    def detect(
        self,
        planets
    ):
        yogas = []

        sun_house = planets.get("Sun")
        jupiter_house = planets.get("Jupiter")

        if (
            sun_house == 10
            and jupiter_house == 9
        ):
            yogas.append(
                "Professional Raj Yoga"
            )

        return yogas

class CEOYogas:
    """
    Detects leadership and entrepreneurship yogas in D10.
    """
    def detect(
        self,
        sun_house,
        mars_house,
        rahu_house
    ):
        yogas = []

        if (
            sun_house == 10
            and mars_house in [1, 10]
        ):
            yogas.append("Executive Leadership Yoga")

        if rahu_house == 10:
            yogas.append("Mass Influence Yoga")

        return yogas

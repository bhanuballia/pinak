# solar_returns/local_progression.py

class LocalProgression:
    """
    Adjusts progression chart
    for local geographic coordinates.
    """

    def apply(
        self,
        chart,
        latitude,
        longitude
    ):
        chart["latitude"] = latitude
        chart["longitude"] = longitude

        return chart

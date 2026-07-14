# solar_returns/location_adjustment.py

class LocationAdjustment:
    """
    Geo-location adjustment engine.
    """

    def adjust(
        self,
        chart,
        timezone
    ):
        chart["timezone"] = timezone

        return chart

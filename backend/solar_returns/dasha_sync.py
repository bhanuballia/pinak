# solar_returns/dasha_sync.py

class DashaSync:
    """
    Dasha + progression integration.
    """

    def synchronize(
        self,
        dasha_lord,
        chart
    ):
        if (
            dasha_lord == "Venus" and
            chart.get("7th_house", 0) > 25
        ):
            return "Marriage Period"

        return "Neutral"

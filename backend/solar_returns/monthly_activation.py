# solar_returns/monthly_activation.py

class MonthlyActivation:
    """
    Detects activated monthly themes.
    """

    def detect(
        self,
        chart
    ):
        events = []

        if chart.get("7th_house", 0) > 28:
            events.append(
                "Marriage Activation"
            )

        if chart.get("10th_house", 0) > 30:
            events.append(
                "Career Activation"
            )

        return events

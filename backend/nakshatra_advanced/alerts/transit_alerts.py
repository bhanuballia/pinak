# nakshatra_advanced/alerts/transit_alerts.py

class TransitAlerts:

    def generate(
        self,
        transit_nak,
        natal_nak
    ):

        if transit_nak == natal_nak:

            return {
                "alert":
                    "Major karmic activation",
                "severity":
                    "HIGH"
            }

        return {
            "alert":
                "Normal transit",
            "severity":
                "LOW"
        }

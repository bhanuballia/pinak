class HealthTransits:

    def evaluate(self, transits):

        alerts = []

        for t in transits:

            if t["planet"] == "Saturn":
                alerts.append(
                    "Fatigue cycle active"
                )

            if t["planet"] == "Mars":
                alerts.append(
                    "Accident-prone period"
                )

        return alerts

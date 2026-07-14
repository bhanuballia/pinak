# solar_returns/monthly_progression.py

from datetime import timedelta

class MonthlyProgression:
    """
    Generates monthly progression charts.
    """

    def generate(
        self,
        solar_return_date,
        months=12
    ):
        charts = []

        for m in range(months):
            progressed_date = (
                solar_return_date +
                timedelta(days=30 * m)
            )

            charts.append({
                "month": m + 1,
                "date":
                    progressed_date
            })

        return charts

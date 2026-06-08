# solar_returns/annual_solar_chart.py

class AnnualSolarChart:
    """
    Builds annual Varshaphala chart.
    """

    def generate(
        self,
        solar_return_data
    ):
        return {
            "date":
                solar_return_data["date"],
            "chart":
                solar_return_data["chart"]
        }

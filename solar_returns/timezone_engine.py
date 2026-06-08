# solar_returns/timezone_engine.py

from datetime import timedelta

class TimezoneEngine:
    """
    Handles timezone conversions.
    """

    def convert(
        self,
        dt,
        offset_hours
    ):
        return dt + timedelta(
            hours=offset_hours
        )

# solar_returns/solar_return_engine.py

from datetime import timedelta

class SolarReturnEngine:
    """
    Calculates exact Solar Return
    when transit Sun reaches natal Sun longitude.
    """

    def calculate(
        self,
        natal_sun_longitude,
        transit_data
    ):
        closest = None
        min_diff = 999

        for t in transit_data:
            diff = abs(
                t["sun_longitude"] -
                natal_sun_longitude
            )

            if diff < min_diff:
                min_diff = diff
                closest = t

        return closest

# ayanamsha/sidereal_engine.py

class SiderealEngine:

    def convert(
        self,
        tropical_longitude,
        ayanamsha
    ):

        return (
            tropical_longitude
            -
            ayanamsha
        ) % 360

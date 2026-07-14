# ayanamsha/true_chitra.py

from math import fmod


class TrueChitraAyanamsha:

    SPICA_REFERENCE = 180.0

    def calculate(
        self,
        spica_longitude
    ):

        ayanamsha = (
            spica_longitude
            -
            self.SPICA_REFERENCE
        )

        ayanamsha = fmod(
            ayanamsha,
            360
        )

        return ayanamsha

    def sidereal_longitude(
        self,
        tropical_longitude,
        ayanamsha
    ):

        return (
            tropical_longitude
            -
            ayanamsha
        ) % 360

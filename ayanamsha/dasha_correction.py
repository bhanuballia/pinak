# ayanamsha/dasha_correction.py

class DashaCorrection:

    def adjust_moon(
        self,
        moon_longitude,
        ayanamsha
    ):

        return (
            moon_longitude
            -
            ayanamsha
        ) % 360

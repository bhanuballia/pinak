# ayanamsha/transit_correction.py

class TransitCorrection:

    def correct(
        self,
        transit_longitude,
        ayanamsha
    ):

        return (
            transit_longitude
            -
            ayanamsha
        ) % 360

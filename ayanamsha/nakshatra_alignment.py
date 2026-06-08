# ayanamsha/nakshatra_alignment.py

NAKSHATRA_SIZE = (
    13 + 20/60
)


class NakshatraAlignment:

    def calculate(
        self,
        sidereal_longitude
    ):

        return int(
            sidereal_longitude
            /
            NAKSHATRA_SIZE
        )

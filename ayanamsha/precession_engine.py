# ayanamsha/precession_engine.py

class PrecessionEngine:

    PRECESSION_RATE = (
        50.290966 / 3600
    )

    def calculate_shift(
        self,
        years
    ):

        return (
            years
            *
            self.PRECESSION_RATE
        )

# ayanamsha/proper_motion.py

class ProperMotion:

    MOTION_PER_YEAR = 0.000001

    def adjust(
        self,
        longitude,
        years
    ):

        return (
            longitude
            +
            (
                years
                *
                self.MOTION_PER_YEAR
            )
        )

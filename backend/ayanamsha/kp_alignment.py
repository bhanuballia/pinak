# ayanamsha/kp_alignment.py

class KPAlignment:

    def align(
        self,
        cusp,
        ayanamsha
    ):

        return (
            cusp
            -
            ayanamsha
        ) % 360

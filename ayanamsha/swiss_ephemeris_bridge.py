# ayanamsha/swiss_ephemeris_bridge.py

import swisseph as swe


class SwissEphemerisBridge:

    def planet_longitude(
        self,
        jd,
        planet
    ):

        result = swe.calc_ut(
            jd,
            planet
        )

        return result[0][0]

    def spica_longitude(
        self,
        jd
    ):

        result = swe.fixstar2_ut(
            "Spica",
            jd
        )

        return result[0][0]

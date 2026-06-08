# astronomy/swiss_ephemeris.py

import swisseph as swe
from datetime import datetime

swe.set_ephe_path("./ephemeris")


class SwissEphemerisEngine:

    def planetary_position(
        self,
        dt: datetime,
        planet_id: int
    ):

        jd = swe.julday(
            dt.year,
            dt.month,
            dt.day,
            dt.hour +
            dt.minute / 60.0
        )

        pos, _ = swe.calc_ut(
            jd,
            planet_id
        )

        return {

            "longitude":
                round(pos[0], 6),

            "latitude":
                round(pos[1], 6),

            "speed":
                round(pos[3], 6)
        }

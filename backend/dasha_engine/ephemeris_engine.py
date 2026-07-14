# pyrefly: ignore [missing-import]
import swisseph as swe
from datetime import datetime

swe.set_sid_mode(swe.SIDM_LAHIRI)


class SwissEphemerisEngine:

    def julian_day(self, dt: datetime):
        return swe.julday(
            dt.year,
            dt.month,
            dt.day,
            dt.hour + dt.minute / 60
        )

    def get_planet_longitude(self, dt, planet_id):

        jd = self.julian_day(dt)

        result = swe.calc_ut(
            jd,
            planet_id,
            swe.FLG_SIDEREAL
        )

        return result[0][0]

    def get_planet_longitude_jd(self, jd, planet_id):
        result = swe.calc_ut(
            jd,
            planet_id,
            swe.FLG_SIDEREAL
        )
        return result[0][0]

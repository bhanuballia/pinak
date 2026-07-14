import swisseph as swe
from astronomy.julian import datetime_to_julian, julian_to_datetime
import datetime

now = datetime.datetime.utcnow()
jd_ut = datetime_to_julian(now)

swe.set_sid_mode(swe.SIDM_LAHIRI)

flags = swe.FLG_SWIEPH | swe.FLG_SIDEREAL
try:
    # Does solcross take flags?
    print(swe.solcross_ut.__doc__)
except Exception as e:
    print(e)

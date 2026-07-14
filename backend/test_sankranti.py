import swisseph as swe
from astronomy.julian import datetime_to_julian, julian_to_datetime
import datetime

# Let's test finding Makar Sankranti (Sun enters Capricorn = 270 degrees) around Jan 14, 2026.
dt_start = datetime.datetime(2026, 1, 14, 0, 0, 0)
jd_start = datetime_to_julian(dt_start)

# Sidereal Ayanamsa setup
swe.set_sid_mode(swe.SIDM_LAHIRI)
flags = swe.FLG_SWIEPH | swe.FLG_SIDEREAL

# Try solcross_ut
jd_cross = swe.solcross_ut(270.0, jd_start, flags)
cross_dt = julian_to_datetime(jd_cross)
print(f"Makar Sankranti 2026 (UTC): {cross_dt}")

# Check with positions.py
from astronomy.positions import get_sidereal_position
swe.set_sid_mode(swe.SIDM_LAHIRI)
pos_start = get_sidereal_position(jd_start, swe.SUN)
pos_end = get_sidereal_position(jd_start + 1.0, swe.SUN)
print(f"Sun Sidereal Lon Start: {pos_start['lon']}")
print(f"Sun Sidereal Lon End: {pos_end['lon']}")

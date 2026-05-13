
import swisseph as swe
import datetime
from astronomy.julian import datetime_to_julian
from core.config import EPHEMERIS_PATH

swe.set_ephe_path(EPHEMERIS_PATH)

# Test data
dt = datetime.datetime(1990, 1, 1, 12, 0, 0)
tz_offset = 5.5
dt_utc = dt - datetime.timedelta(hours=tz_offset)
jd_ut = datetime_to_julian(dt_utc)
lat = 28.6139
lon = 77.2090

print(f"JD UT: {jd_ut}")

# Tropical
swe.set_sid_mode(swe.SIDM_LAHIRI) # Just in case, but flags control calc
cusps, ascmc = swe.houses(jd_ut, lat, lon, b'W')
print(f"Tropical Ascendant (houses 'W'): {ascmc[0]}")

# Sidereal Mode
swe.set_sid_mode(swe.SIDM_LAHIRI)
# NOTE: To get sidereal positions via calc_ut, you need FLG_SIDEREAL.
# But swe.houses doesn't have flags!
# Let's see what it returns now.
cusps, ascmc = swe.houses(jd_ut, lat, lon, b'W')
print(f"Lagna after set_sid_mode: {ascmc[0]}")

# Position calc
res = swe.calc_ut(jd_ut, swe.SUN, swe.FLG_SWIEPH)
print(f"Sun Tropical: {res[0][0]}")

res = swe.calc_ut(jd_ut, swe.SUN, swe.FLG_SWIEPH | swe.FLG_SIDEREAL)
print(f"Sun Sidereal: {res[0][0]}")

ayanamsa = swe.get_ayanamsa(jd_ut)
print(f"Ayanamsa: {ayanamsa}")
print(f"Sun Tropical - Ayanamsa: {res[0][0] + ayanamsa}") # Wait, SunSid = SunTrop - Aya
print(f"Sun Tropical - Ayanamsa normalized: {(280.03 - 23.71) % 360}")

# Is ascmc[0] sidereal?
print(f"Is Lagna Sidereal? {ascmc[0]} vs {ascmc[0] - ayanamsa}")

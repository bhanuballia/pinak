import datetime
from astronomy.julian import datetime_to_julian
from dasha.vimshottari import compute_vimshottari_full
import swisseph as swe

# Birth details
dt_local = datetime.datetime(1988, 2, 7, 14, 9, 0)
tz_offset = 5.5
dt_utc = dt_local - datetime.timedelta(hours=tz_offset)
jd_ut = datetime_to_julian(dt_utc)

# Try different Swiss Ephemeris sidereal modes to find the best match for Parashara's Light
modes = {
    "LAHIRI": swe.SIDM_LAHIRI,
    "FAGAN_BRADLEY": swe.SIDM_FAGAN_BRADLEY,
    "RAMAN": swe.SIDM_RAMAN,
    "KRISHNAMURTI": swe.SIDM_KRISHNAMURTI,
    "DELUCE": swe.SIDM_DELUCE,
    "USHASHASHI": swe.SIDM_USHASHASHI,
    "JN_BHASIN": swe.SIDM_JN_BHASIN,
    "YUKTESHWAR": swe.SIDM_YUKTESHWAR,
}

print(f"Birth JD UT: {jd_ut}")
for name, mode_const in modes.items():
    swe.set_sid_mode(mode_const)
    # Moon is index 1
    res = swe.calc_ut(jd_ut, 1, swe.FLG_SIDEREAL)
    # res is (tuple, flag) or tuple depending on version. Let's handle both!
    if isinstance(res, tuple):
        val = res[0]
        if isinstance(val, (tuple, list)):
            moon_lon = val[0]
        else:
            moon_lon = val
    else:
        moon_lon = res[0]
    
    # Calculate Vimshottari Dasha
    dashas = compute_vimshottari_full(jd_ut, moon_lon, years_ahead=60)
    
    # Find Jup-Mer start date
    jup_dasha = next((d for d in dashas if d["lord"] == "Jupiter"), None)
    if jup_dasha:
        jup_mer = next((ad for ad in jup_dasha["antardashas"] if ad["lord"] == "Mercury"), None)
        if jup_mer:
            from astronomy.julian import julian_to_datetime
            start_dt = julian_to_datetime(jup_mer["start_jd"])
            print(f"Mode: {name:<15} | Moon Lon: {moon_lon:8.4f} | Jup-Mer starts: {start_dt.strftime('%Y-%m-%d %H:%M')}")

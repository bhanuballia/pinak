from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
import swisseph as swe
import datetime as _dt
from astronomy.julian import datetime_to_julian

router = APIRouter()

# Setup Lahiri ayanamsha just in case, though for heliocentric we usually use tropical/sidereal 
# depending on preference. Heliocentric positions are usually tropical, but we can stick to sidereal 
# to match the rest of the app. Let's use sidereal (FLG_SIDEREAL).
swe.set_sid_mode(swe.SIDM_LAHIRI)

@router.post("/heliocentric")
def get_heliocentric_positions(payload: Dict[str, Any] = Body(...)):
    try:
        date = payload["date"]
        time = payload.get("time", "12:00:00")
        tz_offset = float(payload.get("tz_offset", 0.0))
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing {e}")

    # Parse datetime
    try:
        y, m, d = [int(x) for x in date.split("-")]
        tp = [int(x) for x in time.split(":")]
        dt_local = _dt.datetime(y, m, d, tp[0], tp[1], tp[2] if len(tp) > 2 else 0)
        dt_utc = dt_local - _dt.timedelta(hours=tz_offset)
        jd_ut = datetime_to_julian(dt_utc)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid date/time format: {e}")

    # Planets to track: Mercury, Venus, Earth, Mars, Jupiter, Saturn
    planet_ids = {
        "Mercury": swe.MERCURY,
        "Venus": swe.VENUS,
        "Earth": swe.EARTH,
        "Mars": swe.MARS,
        "Jupiter": swe.JUPITER,
        "Saturn": swe.SATURN
    }

    # Flags: Heliocentric + Speed (we want speed_long for smooth UI animation) + Sidereal (optional, but let's keep consistency)
    # Using FLG_HELCTR gives Heliocentric. FLG_SPEED gives speeds in array index 3,4,5
    flags = swe.FLG_HELCTR | swe.FLG_SPEED

    # For Combust / Retrograde, we need Geocentric calculations.
    # We use FLG_SPEED to get geocentric speed and longitude.
    sun_calc = swe.calc_ut(jd_ut, swe.SUN, swe.FLG_SPEED)
    sun_geo_lon = sun_calc[0][0] if isinstance(sun_calc, tuple) and isinstance(sun_calc[0], tuple) else sun_calc[0]

    combust_degrees = {
        "Mercury": 14,
        "Venus": 10,
        "Mars": 17,
        "Jupiter": 11,
        "Saturn": 15
    }

    results = {}
    for name, pid in planet_ids.items():
        try:
            # calc_ut returns ((lon, lat, dist, speed_lon, speed_lat, speed_dist), return_flags)
            calc_res = swe.calc_ut(jd_ut, pid, flags)
            pos = calc_res[0] if isinstance(calc_res, tuple) and isinstance(calc_res[0], tuple) else calc_res
            
            lon = pos[0]
            lat = pos[1]
            dist = pos[2] # in AU
            speed_lon = pos[3] # degrees per day

            is_retrograde = False
            is_combust = False

            if name != "Earth":
                # Geocentric calculation for Retrograde and Combust
                geo_res = swe.calc_ut(jd_ut, pid, swe.FLG_SPEED)
                geo_pos = geo_res[0] if isinstance(geo_res, tuple) and isinstance(geo_res[0], tuple) else geo_res
                geo_lon = geo_pos[0]
                geo_speed = geo_pos[3]

                # Retrograde if geocentric speed is negative
                if geo_speed < 0:
                    is_retrograde = True

                # Combust if angular distance to Sun is within threshold
                diff = abs(geo_lon - sun_geo_lon)
                diff = diff if diff <= 180 else 360 - diff
                
                limit = combust_degrees.get(name, 0)
                if diff <= limit:
                    is_combust = True
            
            results[name] = {
                "lon": lon,
                "radius": dist,
                "speed": speed_lon,
                "isRetrograde": is_retrograde,
                "isCombust": is_combust
            }
        except Exception as e:
            results[name] = {"error": str(e)}

    return {
        "jd_ut": jd_ut,
        "planets": results
    }

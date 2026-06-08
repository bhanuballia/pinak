# panch_pakshi/sunrise_engine.py

import datetime
import math

def get_sunrise_sunset(
    latitude: float,
    longitude: float,
    date_val,
    tz_offset: float = 5.5
):
    """
    Computes highly accurate local Sunrise and Sunset times using NOAA Solar Calculations.
    latitude: North is positive, South is negative.
    longitude: East is positive, West is negative.
    date_val: datetime.date or datetime.datetime object.
    tz_offset: Timezone offset in hours (e.g. +5.5 for IST).
    Returns (sunrise_local, sunset_local) as datetime.datetime objects.
    """
    if isinstance(date_val, datetime.datetime):
        date_local = date_val.date()
    else:
        date_local = date_val

    # Convert coordinates to radians
    lat_rad = math.radians(latitude)
    
    # Zenith for sunrise/sunset (90 degrees 50 minutes = 90.833 degrees)
    zenith = 90.833
    
    # Calculate Julian Day at noon UTC for the date_local
    # Julian Date Calculation (standard formula)
    a = (14 - date_local.month) // 12
    y = date_local.year + 4800 - a
    m = date_local.month + 12 * a - 3
    jdn = date_local.day + (153 * m + 2) // 5 + 365 * y + y // 4 - y // 100 + y // 400 - 32045
    jd = jdn - 0.5
    
    # Julian Century
    t = (jd - 2451545.0) / 36525.0
    
    # Geometric Mean Longitude of Sun (degrees)
    l0 = (280.46646 + t * (36000.76983 + t * 0.0003032)) % 360.0
    
    # Geometric Mean Anomaly of Sun (degrees)
    gma = 357.52911 + t * (35999.05029 - 0.0001537 * t)
    gma_rad = math.radians(gma)
    
    # Eccentricity of Earth's Orbit
    e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t)
    
    # Sun Equation of Center
    sin_gma = math.sin(gma_rad)
    sin_2gma = math.sin(2 * gma_rad)
    sin_3gma = math.sin(3 * gma_rad)
    c = sin_gma * (1.914602 - t * (0.004817 + 0.000014 * t)) + sin_2gma * (0.019993 - 0.000101 * t) + sin_3gma * 0.000289
    
    # Sun True Longitude (degrees)
    true_long = l0 + c
    
    # Sun Apparent Longitude (degrees)
    omega = 125.04 - 1934.136 * t
    omega_rad = math.radians(omega)
    app_long = true_long - 0.00569 - 0.00478 * math.sin(omega_rad)
    app_long_rad = math.radians(app_long)
    
    # Mean Obliquity of Ecliptic (degrees)
    seconds = 21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))
    mean_obliq = 23.0 + (26.0 + seconds / 60.0) / 60.0
    
    # Obliquity Correction (degrees)
    obliq_corr = mean_obliq + 0.00256 * math.cos(omega_rad)
    obliq_corr_rad = math.radians(obliq_corr)
    
    # Sun Declination (radians)
    decl_rad = math.asin(math.sin(obliq_corr_rad) * math.sin(app_long_rad))
    
    # Var y
    var_y = math.tan(obliq_corr_rad / 2.0) ** 2
    
    # Equation of Time (minutes)
    l0_rad = math.radians(l0)
    eq_time = 4.0 * math.degrees(
        var_y * math.sin(2.0 * l0_rad) -
        2.0 * e * math.sin(gma_rad) +
        4.0 * e * var_y * math.sin(gma_rad) * math.cos(2.0 * l0_rad) -
        0.5 * var_y * var_y * math.sin(4.0 * l0_rad) -
        1.25 * e * e * math.sin(2.0 * gma_rad)
    )
    
    # Hour Angle for sunrise/sunset (degrees)
    val = math.cos(math.radians(zenith)) / (math.cos(lat_rad) * math.cos(decl_rad)) - math.tan(lat_rad) * math.tan(decl_rad)
    
    if val > 1.0:
        # Sun never rises (polar night)
        ha = 0.0
    elif val < -1.0:
        # Sun never sets (polar day)
        ha = 180.0
    else:
        ha = math.degrees(math.acos(val))
    
    # Solar Noon (UTC minutes from midnight)
    sol_noon_utc = (720.0 - 4.0 * longitude - eq_time) % 1440.0
    
    # Sunrise and Sunset (UTC minutes from midnight)
    sunrise_utc = sol_noon_utc - 4.0 * ha
    sunset_utc = sol_noon_utc + 4.0 * ha
    
    # Convert to local time in minutes from midnight
    sunrise_local_m = (sunrise_utc + tz_offset * 60.0) % 1440.0
    sunset_local_m = (sunset_utc + tz_offset * 60.0) % 1440.0
    
    # Convert minutes to hours, minutes, seconds
    def minutes_to_hms(minutes):
        hours = int(minutes // 60)
        minutes_rem = minutes % 60
        mins = int(minutes_rem)
        secs = int((minutes_rem - mins) * 60)
        return hours, mins, secs

    sr_h, sr_m, sr_s = minutes_to_hms(sunrise_local_m)
    ss_h, ss_m, ss_s = minutes_to_hms(sunset_local_m)
    
    sunrise_dt = datetime.datetime(date_local.year, date_local.month, date_local.day, sr_h, sr_m, sr_s)
    sunset_dt = datetime.datetime(date_local.year, date_local.month, date_local.day, ss_h, ss_m, ss_s)
    
    return sunrise_dt, sunset_dt


import math
import datetime
from typing import Tuple, Optional

def calculate_noaa_sunrise_sunset(
    date: datetime.date, lat: float, lon: float, tz_offset: float
) -> Tuple[Optional[datetime.datetime], Optional[datetime.datetime]]:
    """
    Calculates precise Sunrise and Sunset times using the NOAA Solar Calculator algorithm.
    Returns (sunrise_dt, sunset_dt).
    """
    def calc_jd(date):
        a = math.floor((14 - date.month) / 12)
        y = date.year + 4800 - a
        m = date.month + 12 * a - 3
        return date.day + math.floor((153 * m + 2) / 5) + 365 * y + math.floor(y / 4) - math.floor(y / 100) + math.floor(y / 400) - 32045 - 0.5
    
    jd = calc_jd(date)
    jc = (jd - 2451545.0) / 36525.0
    
    geom_mean_long_sun = (280.46646 + jc * (36000.76983 + jc * 0.0003032)) % 360
    geom_mean_anom_sun = 357.52911 + jc * (35999.05029 - 0.0001537 * jc)
    
    eccent_earth_orbit = 0.016708634 - jc * (0.000042037 + 0.0000001267 * jc)
    
    sun_eq_of_ctr = math.sin(math.radians(geom_mean_anom_sun)) * (1.914602 - jc * (0.004817 + 0.000014 * jc)) + \
                    math.sin(math.radians(2 * geom_mean_anom_sun)) * (0.019993 - 0.000101 * jc) + \
                    math.sin(math.radians(3 * geom_mean_anom_sun)) * 0.000289
                    
    sun_true_long = geom_mean_long_sun + sun_eq_of_ctr
    sun_app_long = sun_true_long - 0.00569 - 0.00478 * math.sin(math.radians(125.04 - 1934.136 * jc))
    
    mean_obliq_ecliptic = 23 + (26 + ((21.448 - jc * (46.815 + jc * (0.00059 - jc * 0.001813)))) / 60) / 60
    obliq_corr = mean_obliq_ecliptic + 0.00256 * math.cos(math.radians(125.04 - 1934.136 * jc))
    
    sun_decl = math.degrees(math.asin(math.sin(math.radians(obliq_corr)) * math.sin(math.radians(sun_app_long))))
    
    var_y = math.tan(math.radians(obliq_corr / 2)) ** 2
    
    eq_of_time = 4 * math.degrees(var_y * math.sin(2 * math.radians(geom_mean_long_sun)) - \
                 2 * eccent_earth_orbit * math.sin(math.radians(geom_mean_anom_sun)) + \
                 4 * eccent_earth_orbit * var_y * math.sin(math.radians(geom_mean_anom_sun)) * math.cos(2 * math.radians(geom_mean_long_sun)) - \
                 0.5 * var_y * var_y * math.sin(4 * math.radians(geom_mean_long_sun)) - \
                 1.25 * eccent_earth_orbit * eccent_earth_orbit * math.sin(2 * math.radians(geom_mean_anom_sun)))
                 
    ha_arg = math.cos(math.radians(90.833)) / (math.cos(math.radians(lat)) * math.cos(math.radians(sun_decl))) - math.tan(math.radians(lat)) * math.tan(math.radians(sun_decl))
    
    if ha_arg < -1 or ha_arg > 1:
        return None, None
        
    ha_sunrise = math.degrees(math.acos(ha_arg))
    
    solar_noon = (720 - 4 * lon - eq_of_time + tz_offset * 60) / 1440
    
    sunrise_time = solar_noon - ha_sunrise * 4 / 1440
    sunset_time = solar_noon + ha_sunrise * 4 / 1440
    
    def frac_to_time(fraction):
        fraction = fraction % 1.0
        total_seconds = fraction * 86400
        hours = int(total_seconds // 3600)
        minutes = int((total_seconds % 3600) // 60)
        seconds = int(total_seconds % 60)
        return datetime.time(hours, minutes, seconds)
        
    try:
        rise_time = frac_to_time(sunrise_time)
        set_time = frac_to_time(sunset_time)
        return (datetime.datetime.combine(date, rise_time), datetime.datetime.combine(date, set_time))
    except ValueError:
        return None, None

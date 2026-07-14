import os
import sys
from datetime import datetime
sys.path.append(r"d:\vedic-astrology-app - 2 - okFinal - Deploy")
from astronomy.sidereal import set_ayanamsa
from astronomy.positions import get_sun_moon_sidereal
from astronomy.julian import datetime_to_julian, julian_to_datetime

def normalize_degrees(deg):
    return deg % 360.0

def calculate_exact_tithi_pravesha(natal_jd_ut: float, target_year: int) -> float:
    # Get natal Sun and Moon
    set_ayanamsa()
    natal_pos = get_sun_moon_sidereal(natal_jd_ut)
    natal_sun = natal_pos["Sun"]
    natal_moon = natal_pos["Moon"]
    natal_diff = normalize_degrees(natal_moon - natal_sun)
    natal_tithi_num = int(natal_diff / 12) + 1
    
    natal_dt = julian_to_datetime(natal_jd_ut)
    approx_dt = datetime(target_year, natal_dt.month, natal_dt.day, natal_dt.hour, natal_dt.minute)
    approx_jd = datetime_to_julian(approx_dt)
    
    start_jd = approx_jd - 35
    end_jd = approx_jd + 35
    
    best_jd = None
    min_diff_err = 999.0
    
    jd = start_jd
    while jd <= end_jd:
        pos = get_sun_moon_sidereal(jd)
        sun_lon = pos["Sun"]
        moon_lon = pos["Moon"]
        
        diff = normalize_degrees(moon_lon - sun_lon)
        tithi_num = int(diff / 12) + 1
        
        sun_sign = int(sun_lon / 30)
        natal_sun_sign = int(natal_sun / 30)
        
        if sun_sign == natal_sun_sign and tithi_num == natal_tithi_num:
            err = abs(normalize_degrees(diff - natal_diff + 180) - 180)
            if err < min_diff_err:
                min_diff_err = err
                best_jd = jd
        jd += 0.1

    if best_jd is None:
        jd = start_jd
        while jd <= end_jd:
            pos = get_sun_moon_sidereal(jd)
            sun_lon = pos["Sun"]
            moon_lon = pos["Moon"]
            diff = normalize_degrees(moon_lon - sun_lon)
            tithi_num = int(diff / 12) + 1
            if tithi_num == natal_tithi_num:
                err = abs(normalize_degrees(diff - natal_diff + 180) - 180)
                if err < min_diff_err:
                    min_diff_err = err
                    best_jd = jd
            jd += 0.1
            
    if best_jd is None:
        return approx_jd
        
    t0 = best_jd - 0.5
    t1 = best_jd + 0.5
    
    def f(t):
        p = get_sun_moon_sidereal(t)
        d = normalize_degrees(p["Moon"] - p["Sun"])
        return normalize_degrees(d - natal_diff + 180) - 180
        
    for _ in range(40):
        tm = (t0 + t1) / 2
        fm = f(tm)
        f0 = f(t0)
        if f0 * fm <= 0:
            t1 = tm
        else:
            t0 = tm
            
    return (t0 + t1) / 2

if __name__ == "__main__":
    # Test for someone born 1990-05-15 12:00:00 UT
    test_jd = datetime_to_julian(datetime(1990, 5, 15, 12, 0, 0))
    tp_jd = calculate_exact_tithi_pravesha(test_jd, 2026)
    print("Natal JD:", test_jd)
    print("Tithi Pravesha JD 2026:", tp_jd)
    print("Tithi Pravesha Date:", julian_to_datetime(tp_jd))

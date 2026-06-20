# panchang/adhik_maas.py
import swisseph as swe

def get_elongation_fast(jd_ut: float) -> float:
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    sun_lon = swe.calc_ut(jd_ut, swe.SUN, swe.FLG_SWIEPH | swe.FLG_SIDEREAL)[0][0]
    moon_lon = swe.calc_ut(jd_ut, swe.MOON, swe.FLG_SWIEPH | swe.FLG_SIDEREAL)[0][0]
    return (moon_lon - sun_lon) % 360.0

def find_amavasya_fast(jd_start: float, direction: int) -> float:
    jd = jd_start
    e = get_elongation_fast(jd)
    
    if direction == -1:
        days_to_jump = - (e / 12.19)
    else:
        days_to_jump = (360.0 - e) / 12.19
            
    jd_approx = jd + days_to_jump
    
    for _ in range(10):
        e_approx = get_elongation_fast(jd_approx)
        if e_approx > 180:
            e_approx -= 360.0
        err_days = - (e_approx / 12.19)
        jd_approx += err_days
        if abs(err_days) < 0.0001:
            break
            
    return jd_approx

def check_adhik_maas(jd_ut: float) -> bool:
    """
    Check if the lunar month containing this JD is an Adhik Maas.
    A lunar month is an Adhik Maas if the Sun's Sidereal Rashi is the same 
    at the previous Amavasya and the next Amavasya.
    """
    jd_prev = find_amavasya_fast(jd_ut, -1)
    jd_next = find_amavasya_fast(jd_ut, 1)
    
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    sun_prev = swe.calc_ut(jd_prev, swe.SUN, swe.FLG_SWIEPH | swe.FLG_SIDEREAL)[0][0]
    sun_next = swe.calc_ut(jd_next, swe.SUN, swe.FLG_SWIEPH | swe.FLG_SIDEREAL)[0][0]
    
    rashi_prev = int(sun_prev // 30)
    rashi_next = int(sun_next // 30)
    
    return rashi_prev == rashi_next

def find_next_adhik_maas(jd_start: float) -> float:
    """
    Scans forward to find the next Adhik Maas.
    Returns the JD of the Purnima of the next Adhik Maas.
    """
    jd_current = jd_start
    jd_current = find_amavasya_fast(jd_current, 1)
    
    for _ in range(40):
        is_adhik = check_adhik_maas(jd_current + 15)
        if is_adhik:
            jd_purnima = jd_current + 14.76
            return jd_purnima
        
        jd_current = find_amavasya_fast(jd_current + 20, 1)

    return None

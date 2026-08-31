# dasha/yogini.py

YOGINI_ORDER = ["Mangala", "Pingala", "Dhanya", "Bhramari", "Bhadrika", "Ulka", "Siddha", "Sankata"]
YOGINI_DUR = {
    "Mangala": 1,
    "Pingala": 2,
    "Dhanya": 3,
    "Bhramari": 4,
    "Bhadrika": 5,
    "Ulka": 6,
    "Siddha": 7,
    "Sankata": 8
}

def _jd_add_years(jd_start: float, years: float) -> float:
    return jd_start + years * 365.2425

def _compute_antardashas_for_maha(maha_lord: str, maha_duration: float, start_jd: float) -> list:
    """
    Antardashas start from the Mahadasha lord itself and cycle through YOGINI_ORDER.
    Duration of each is proportional: (maha_duration * YOGINI_DUR[lord]) / 36
    """
    denom = 36.0
    antars = []
    cur_start = start_jd
    
    start_idx = YOGINI_ORDER.index(maha_lord)
    for i in range(8):
        lord = YOGINI_ORDER[(start_idx + i) % 8]
        frac = YOGINI_DUR[lord] / denom
        dur_years = maha_duration * frac
        end = _jd_add_years(cur_start, dur_years)
        antars.append({
            "lord": lord,
            "start_jd": cur_start,
            "end_jd": end,
            "duration_years": dur_years
        })
        cur_start = end
    return antars

def compute_yogini_full(jd_ut: float, moon_sidereal_long: float, years_ahead: float = 108.0) -> list:
    """
    Computes Yogini Dasha structure.
    Total cycle is 36 years.
    """
    nak_deg = 13.333333333333334
    nak_idx = int(moon_sidereal_long // nak_deg) % 27
    pos_in_nak = (moon_sidereal_long % nak_deg) / nak_deg
    
    # Starting Yogini calculation: (Nakshatra number + 3) % 8
    # nak_idx is 0-26, so Nakshatra number is nak_idx + 1
    num = (nak_idx + 1 + 3) % 8
    if num == 0:
        start_idx = 7
    else:
        start_idx = num - 1
        
    start_lord = YOGINI_ORDER[start_idx]
    
    # Theoretical start of first Mahadasha before birth
    first_total_years = YOGINI_DUR[start_lord]
    theoretical_elapsed_years = pos_in_nak * first_total_years
    theoretical_start_jd = jd_ut - theoretical_elapsed_years * 365.2425
    
    out = []
    jd_cursor = theoretical_start_jd
    idx = start_idx
    
    # We will generate enough mahadashas to cover years_ahead *after* birth (jd_ut)
    end_jd_target = jd_ut + years_ahead * 365.2425
    
    while jd_cursor < end_jd_target:
        lord = YOGINI_ORDER[idx % 8]
        duration = float(YOGINI_DUR[lord])
        start_jd = jd_cursor
        end_jd = _jd_add_years(start_jd, duration)
        
        antars = _compute_antardashas_for_maha(lord, duration, start_jd)
        
        out.append({
            "lord": lord,
            "start_jd": start_jd,
            "end_jd": end_jd,
            "duration_years": duration,
            "antardashas": antars
        })
        
        jd_cursor = end_jd
        idx += 1
        
    return out

compute_yogini = compute_yogini_full

# dasha/vimshottari.py

VIM_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
VIM_DUR = {"Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7, "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17}

def _jd_add_years(jd_start: float, years: float) -> float:
    return jd_start + years * 365.2425

def _compute_antardashas_for_maha(maha_lord: str, maha_duration: float, start_jd: float) -> list:
    """
    Antardashas start from the Mahadasha lord itself and cycle through VIM_ORDER.
    Duration of each is proportional: (maha_duration * VIM_DUR[lord]) / 120
    """
    denom = 120.0
    antars = []
    cur_start = start_jd
    
    start_idx = VIM_ORDER.index(maha_lord)
    for i in range(9):
        lord = VIM_ORDER[(start_idx + i) % 9]
        frac = VIM_DUR[lord] / denom
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

def compute_vimshottari_full(jd_ut: float, moon_sidereal_long: float, years_ahead: float = 120.0) -> list:
    """
    Computes a nested Vimshottari structure.
    To avoid compressing the birth dasha, we find the theoretical start JD of the first Mahadasha,
    then compute all subsequent dashas using their full standard durations.
    """
    nak_deg = 13.333333333333334
    nak_idx = int(moon_sidereal_long // nak_deg) % 27
    pos_in_nak = (moon_sidereal_long % nak_deg) / nak_deg
    
    start_lord = VIM_ORDER[nak_idx % 9]
    start_idx = VIM_ORDER.index(start_lord)
    
    # Theoretical start of first Mahadasha before birth
    first_total_years = VIM_DUR[start_lord]
    theoretical_elapsed_years = pos_in_nak * first_total_years
    theoretical_start_jd = jd_ut - theoretical_elapsed_years * 365.2425
    
    out = []
    jd_cursor = theoretical_start_jd
    idx = start_idx
    
    # We will generate enough mahadashas to cover years_ahead *after* birth (jd_ut)
    end_jd_target = jd_ut + years_ahead * 365.2425
    
    while jd_cursor < end_jd_target:
        lord = VIM_ORDER[idx % 9]
        duration = float(VIM_DUR[lord])
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


# Backwards-compatibility alias: some modules import `compute_vimshottari`
# while this file exposes `compute_vimshottari_full`. Provide the shorter
# name as a direct alias so imports succeed.
compute_vimshottari = compute_vimshottari_full

# astrology/sade_sati.py

def calculate_sade_sati_phase(moon_sign_index, saturn_sign_index):
    rising_sign = (moon_sign_index - 1 + 12) % 12
    peak_sign    = moon_sign_index
    setting_sign = (moon_sign_index + 1) % 12
    
    if saturn_sign_index == rising_sign:
        return "Rising"
    elif saturn_sign_index == peak_sign:
        return "Peak"
    elif saturn_sign_index == setting_sign:
        return "Setting"
    else:
        return "No Sade Sati"

def check_degree_peak(natal_moon_degree, transit_saturn_degree, threshold=1.0):
    return abs(transit_saturn_degree - natal_moon_degree) <= threshold

def calculate_all_life_cycles(natal_moon_sign, birth_year):
    """
    Calculates 3 major Sade Sati cycles in a person's life (~0-30, 30-60, 60-90).
    Approximate based on Saturn's ~2.458 years per sign.
    """
    # Ref: Saturn entered Aquarius (sign 10) in April 2023
    ref_year = 2023.04
    ref_sign = 10 
    
    # Sade Sati starts when Saturn enters 12th sign from Moon
    s12 = (natal_moon_sign - 1 + 12) % 12
    
    # Find first cycle start relative to birth
    first_cycle_start = ref_year + (s12 - ref_sign) * 2.458
    while first_cycle_start > birth_year + 5: first_cycle_start -= 29.5
    while first_cycle_start < birth_year - 15: first_cycle_start += 29.5

    all_cycles = []
    for cycle_num in range(1, 4):
        cycle_base = first_cycle_start + (cycle_num - 1) * 29.5
        phases = []
        for i, p_name in enumerate(["Rising", "Peak", "Setting"]):
            p_start = cycle_base + i * 2.458
            phases.append({
                "phase": p_name,
                "start": int(p_start),
                "end": int(p_start + 2.5),
                "age": int(p_start - birth_year)
            })
        all_cycles.append({
            "cycle": cycle_num,
            "phases": phases,
            "summary": f"{int(phases[0]['start'])} — {int(phases[2]['end'])}"
        })
    return all_cycles

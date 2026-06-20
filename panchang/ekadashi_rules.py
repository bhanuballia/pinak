from panchang.tithi_yoga_karana import compute_tithi

def get_tithi_index(jd: float) -> int:
    return compute_tithi(jd)["tithi_index"]

def check_ekadashi_vrat(jd_sunrise: float, jd_prev_sunrise: float) -> str:
    """
    Evaluates if the current sunrise qualifies as the Ekadashi Fasting day.
    Returns "Shukla", "Krishna", or None.
    """
    # 240 minutes = 240 / 1440 days = 0.166666
    jd_240 = jd_sunrise + (240.0 / 1440.0)
    jd_prev_240 = jd_prev_sunrise + (240.0 / 1440.0)
    
    t_today = get_tithi_index(jd_sunrise)
    t_today_240 = get_tithi_index(jd_240)
    
    t_prev = get_tithi_index(jd_prev_sunrise)
    t_prev_240 = get_tithi_index(jd_prev_240)

    # Check if Ekadashi was active between prev_sunrise and today_sunrise
    # We do a mid-day check just in case
    t_prev_mid = get_tithi_index(jd_prev_sunrise + 0.5)

    is_ekadashi_today = t_today in (10, 25)
    is_ekadashi_today_240 = t_today_240 in (10, 25)
    
    is_ekadashi_prev = t_prev in (10, 25)
    is_ekadashi_prev_240 = t_prev_240 in (10, 25)
    is_dashami_prev = t_prev in (9, 24)

    ekadashi_happened_yesterday = is_dashami_prev and (t_prev_mid in (10, 25) or get_tithi_index(jd_sunrise - 0.1) in (10, 25))

    def get_paksha(t_idx: int) -> str:
        if 0 <= t_idx <= 14:
            return "Shukla"
        return "Krishna"

    # Scenario 1: Pure Ekadashi today
    if is_ekadashi_today and is_ekadashi_today_240:
        # If yesterday was Dashami Vedha, TODAY is the pure fast.
        if is_dashami_prev:
            return get_paksha(t_today)
        # If yesterday was Ekadashi too. Usually fast on the first day if it was pure, or second if yesterday was short.
        if is_ekadashi_prev:
            if not is_ekadashi_prev_240:
                return get_paksha(t_today) # Yesterday was too short, fast today
            return None # Yesterday was pure, so fast was yesterday
        return get_paksha(t_today)

    # Scenario 2: Today is Dwadashi, but we must fast today because yesterday's Ekadashi was rejected
    is_dwadashi_today = t_today in (11, 26)
    if is_dwadashi_today:
        if is_dashami_prev and ekadashi_happened_yesterday:
            # Yesterday was Dashami Vedha. Fast pushed to today.
            return "Shukla" if t_today == 11 else "Krishna"
        if is_ekadashi_prev and not is_ekadashi_prev_240:
            # Yesterday Ekadashi was too short (<240 mins). Fast pushed to today.
            return "Shukla" if t_today == 11 else "Krishna"

    return None

def check_smarta_ekadashi_vrat(jd_sunrise: float, jd_prev_sunrise: float, jd_next_sunrise: float) -> str:
    """
    Evaluates if the current sunrise qualifies as the Ekadashi Fasting day
    according to the Smarta (Nirnaya Sindhu) rules.
    """
    t_today = get_tithi_index(jd_sunrise)
    t_tomorrow = get_tithi_index(jd_next_sunrise)
    
    # 1. Standard / Vriddhi Rule: If today's sunrise is Ekadashi, fast today.
    # Note: If it's a Vriddhi (spans two sunrises), Smarta usually fasts on the first day.
    if t_today in (10, 25):  # 10=Shukla Ekadashi, 25=Krishna Ekadashi
        return "Shukla" if t_today == 10 else "Krishna"
        
    # 2. Kshaya Rule: If today is Dashami and tomorrow is Dwadashi, 
    # but Ekadashi happened in between, we fast tomorrow.
    # So if we are currently checking "tomorrow" (which is Dwadashi), 
    # and yesterday was Dashami, this means today is the fast.
    
    # Let's frame it from the perspective of "Should we fast TODAY?"
    # If today is Dwadashi (11, 26), and yesterday was Dashami (9, 24),
    # it means Ekadashi was completely lost (Kshaya). The fast is today.
    t_prev = get_tithi_index(jd_prev_sunrise)
    if t_today in (11, 26) and t_prev in (9, 24):
        # We verify Ekadashi actually happened in between sunrises
        t_midday = get_tithi_index(jd_prev_sunrise + 0.5)
        if t_midday in (10, 25) or get_tithi_index(jd_sunrise - 0.1) in (10, 25):
            return "Shukla" if t_today == 11 else "Krishna"
            
    return None

# astrology/panoti.py

def detect_small_panoti(moon_sign_index, saturn_sign_index):
    """
    Ardha Ashtama: Saturn in 4th from Natal Moon
    Ashtama: Saturn in 8th from Natal Moon
    Kantaka Shani: Saturn in 10th from Natal Moon
    """
    res = {
        "ashtama_shani": False,
        "ardha_ashtama": False,
        "kantaka_shani": False
    }
    
    # Calculate distance from moon to saturn (in signs)
    diff = (saturn_sign_index - moon_sign_index + 12) % 12
    
    if diff == 3: # 4th house (index 3 away)
        res["ardha_ashtama"] = True
    elif diff == 7: # 8th house (index 7 away)
        res["ashtama_shani"] = True
    elif diff == 9: # 10th house (index 9 away)
        res["kantaka_shani"] = True
        
    return res

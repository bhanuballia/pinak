# matchmaking/guna_milan/tara.py

def calculate_tara(bride_nak_idx: int, groom_nak_idx: int) -> float:
    """Tara Koota (Destiny & Fortune) - 3 Points"""
    # Count from bride to groom
    diff_b_g = (groom_nak_idx - bride_nak_idx) % 9 + 1
    # Count from groom to bride
    diff_g_b = (bride_nak_idx - groom_nak_idx) % 9 + 1
    
    # 1, 3, 5, 7 are bad
    bad = [3, 5, 7]
    b_ok = diff_b_g not in bad
    g_ok = diff_g_b not in bad
    
    if b_ok and g_ok: return 3.0
    if b_ok or g_ok: return 1.5
    return 0.0

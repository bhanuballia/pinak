# matchmaking/guna_milan/bhakoot.py

def calculate_bhakoot(bride_sign_idx: int, groom_sign_idx: int) -> float:
    """Bhakoot Koota (Emotional & Life compatibility) - 7 Points"""
    diff = (groom_sign_idx - bride_sign_idx) % 12
    # 2-12, 5-9, 6-8 are bad
    if diff in [0, 1, 4, 5, 7, 8, 11]: # 1-1, 2-12, 5-9, 6-8 (relative)
        if diff in [1, 11]: return 0.0 # 2-12
        if diff in [5, 7]: return 0.0  # 6-8
        if diff in [4, 8]: return 0.0  # 5-9
    return 7.0

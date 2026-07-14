# matchmaking/guna_milan/nadi.py

def calculate_nadi(bride_nadi: str, groom_nadi: str) -> float:
    """Nadi Koota (Genetic & Health compatibility) - 8 Points"""
    if not bride_nadi or not groom_nadi:
        return 0.0
    if bride_nadi != groom_nadi:
        return 8.0
    return 0.0

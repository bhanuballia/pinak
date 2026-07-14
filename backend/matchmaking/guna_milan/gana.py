# matchmaking/guna_milan/gana.py

def calculate_gana(bride_gana: str, groom_gana: str) -> float:
    """Gana Koota (Temperament compatibility) - 6 Points"""
    if bride_gana == groom_gana:
        return 6.0
    if (bride_gana == "Deva" and groom_gana == "Manushya") or (bride_gana == "Manushya" and groom_gana == "Deva"):
        return 5.0
    if (bride_gana == "Deva" and groom_gana == "Rakshasa") or (bride_gana == "Rakshasa" and groom_gana == "Deva"):
        return 1.0
    return 0.0 # Manushya-Rakshasa

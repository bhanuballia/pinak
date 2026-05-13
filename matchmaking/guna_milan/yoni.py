# matchmaking/guna_milan/yoni.py
from matchmaking.guna_milan.nakshatra_data import YONI_COMPATIBILITY

def calculate_yoni(bride_yoni: str, groom_yoni: str) -> float:
    """Yoni Koota (Biological & Sexual compatibility) - 4 Points"""
    if not bride_yoni or not groom_yoni:
        return 0.0
    return float(YONI_COMPATIBILITY.get(bride_yoni, {}).get(groom_yoni, 0))

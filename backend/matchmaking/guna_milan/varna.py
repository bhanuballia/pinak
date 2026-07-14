# matchmaking/guna_milan/varna.py
from typing import Dict, Any

VARNA_ORDER = {
    "Brahmin": 4,
    "Kshatriya": 3,
    "Vaishya": 2,
    "Shudra": 1
}

def calculate_varna(bride_varna: str, groom_varna: str) -> float:
    """Varna Koota (Work & Ego compatibility) - 1 Point"""
    b_val = VARNA_ORDER.get(bride_varna, 0)
    g_val = VARNA_ORDER.get(groom_varna, 0)
    
    if g_val >= b_val:
        return 1.0
    return 0.0

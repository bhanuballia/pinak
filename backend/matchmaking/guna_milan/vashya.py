# matchmaking/guna_milan/vashya.py

VASHYA_GROUPS = {
    "Chatuspad": ["Aries", "Taurus", "Sagittarius_first_half", "Capricorn_second_half"],
    "Manav": ["Gemini", "Virgo", "Libra", "Aquarius", "Sagittarius_second_half"],
    "Jalchar": ["Cancer", "Pisces", "Capricorn_first_half"],
    "Vanachar": ["Leo"],
    "Keeta": ["Scorpio"]
}

VASHYA_MATRIX = {
    "Chatuspad": {"Chatuspad": 2, "Manav": 1, "Jalchar": 1, "Vanachar": 0, "Keeta": 1},
    "Manav": {"Chatuspad": 0, "Manav": 2, "Jalchar": 1, "Vanachar": 0, "Keeta": 1},
    "Jalchar": {"Chatuspad": 1, "Manav": 0, "Jalchar": 2, "Vanachar": 1, "Keeta": 1},
    "Vanachar": {"Chatuspad": 0, "Manav": 0, "Jalchar": 1, "Vanachar": 2, "Keeta": 0},
    "Keeta": {"Chatuspad": 1, "Manav": 1, "Jalchar": 1, "Vanachar": 0, "Keeta": 2}
}

def calculate_vashya(bride_vashya: str, groom_vashya: str) -> float:
    """Vashya Koota (Dominance & Attraction) - 2 Points"""
    if not bride_vashya or not groom_vashya:
        return 0.0
    return float(VASHYA_MATRIX.get(bride_vashya, {}).get(groom_vashya, 0))

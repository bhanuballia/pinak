# matchmaking/guna_milan/graha_maitri.py

FRIENDSHIP_SCORES = {
    "Sun": {"Sun": 5, "Moon": 5, "Mars": 5, "Mercury": 4, "Jupiter": 5, "Venus": 0, "Saturn": 0},
    "Moon": {"Sun": 5, "Moon": 5, "Mars": 4, "Mercury": 1, "Jupiter": 4, "Venus": 0.5, "Saturn": 0.5},
    "Mars": {"Sun": 5, "Moon": 4, "Mars": 5, "Mercury": 0.5, "Jupiter": 5, "Venus": 3, "Saturn": 0.5},
    "Mercury": {"Sun": 4, "Moon": 1, "Mars": 0.5, "Mercury": 5, "Jupiter": 0.5, "Venus": 5, "Saturn": 4},
    "Jupiter": {"Sun": 5, "Moon": 4, "Mars": 5, "Mercury": 0.5, "Jupiter": 5, "Venus": 0.5, "Saturn": 3},
    "Venus": {"Sun": 0, "Moon": 0.5, "Mars": 3, "Mercury": 5, "Jupiter": 0.5, "Venus": 5, "Saturn": 5},
    "Saturn": {"Sun": 0, "Moon": 0.5, "Mars": 0.5, "Mercury": 4, "Jupiter": 3, "Venus": 5, "Saturn": 5}
}

def calculate_graha_maitri(bride_lord: str, groom_lord: str) -> float:
    """Graha Maitri (Mental & Lord compatibility) - 5 Points"""
    if not bride_lord or not groom_lord:
        return 0.0
    if bride_lord == groom_lord:
        return 5.0
    s1 = FRIENDSHIP_SCORES.get(bride_lord, {}).get(groom_lord, 0)
    s2 = FRIENDSHIP_SCORES.get(groom_lord, {}).get(bride_lord, 0)
    return float((s1 + s2) / 2.0)

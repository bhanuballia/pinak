# shadbala/rahu_ketu_strength.py

def calculate_rahu_strength(
    sign
):
    """
    Rahu is exalted in Taurus (1) and Gemini (2) per some traditions,
    or Taurus (1) / Aries (0) per others.
    Signs are 0-indexed (0=Aries ... 11=Pisces).
    Returns Rupa score 0–18.
    """
    exalted = [1, 10]   # Taurus, Capricorn

    if sign in exalted:
        return 18.0

    return 10.0


def calculate_ketu_strength(
    sign
):
    """
    Ketu is exalted in Scorpio (7) and Sagittarius (8) per some traditions.
    Signs are 0-indexed (0=Aries ... 11=Pisces).
    Returns Rupa score 0–18.
    """
    exalted = [7, 8]    # Scorpio, Sagittarius

    if sign in exalted:
        return 18.0

    return 10.0

# astrology/moon.py

def calculate_moon_sign(moon_longitude):
    """
    Returns the index of the moon sign (0-11).
    0: Aries, 1: Taurus, ..., 11: Pisces
    """
    return int(moon_longitude / 30)

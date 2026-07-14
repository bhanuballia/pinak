# ashtakavarga/rekha_rules.py

def is_bindu(relative_house, bindu_houses):
    """
    Returns True if relative_house is a bindu position for the given planet.
    A 'rekha' (malefic mark) is implied when this returns False.
    """
    return relative_house in bindu_houses

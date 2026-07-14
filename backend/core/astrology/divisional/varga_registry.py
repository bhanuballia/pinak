# core/astrology/divisional/varga_registry.py
from core.astrology.divisional.d20_vimsamsa import D20Vimsamsa
from core.astrology.divisional.d27_bhamsa import D27Bhamsa
from core.astrology.divisional.d40_khavedamsa import D40Khavedamsa
from core.astrology.divisional.d45_akshavedamsa import D45Akshavedamsa

VARGA_REGISTRY = {
    20: D20Vimsamsa,
    27: D27Bhamsa,
    40: D40Khavedamsa,
    45: D45Akshavedamsa
}

def get_varga_calculator(d_number):
    """
    Returns an instance of the calculator for the given D-number.
    """
    cls = VARGA_REGISTRY.get(d_number)
    return cls() if cls else None

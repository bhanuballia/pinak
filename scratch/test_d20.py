import sys
sys.path.append(".")
from core.astrology.divisional.d20_vimsamsa import D20Vimsamsa

d20 = D20Vimsamsa()

# Test cases
tests = [
    # Movable sign: Aries (0) -> Starts from Aries (0)
    (0, "Aries 0°", 0), # part 1 of Aries = Aries
    (25, "Aries 25°", 4), # part 17 of Aries = 0 + 16 = 16 % 12 = 4 (Leo)
    # Fixed sign: Taurus (1) -> Starts from Sagittarius (8)
    (30, "Taurus 0°", 8), # part 1 of Taurus = Sagittarius
    (31.5, "Taurus 1.5°", 9), # part 2 of Taurus = Capricorn
    # Dual sign: Gemini (2) -> Starts from Leo (4)
    (60, "Gemini 0°", 4), # part 1 of Gemini = Leo
]

for lon, desc, expected in tests:
    res = d20.calculate(lon)
    sign = res["sign_index"]
    name = res["sign_name"]
    print(f"{desc}: Expected {expected}, got {sign} ({name})")
    assert sign == expected, f"Failed for {desc}"

print("All tests passed!")

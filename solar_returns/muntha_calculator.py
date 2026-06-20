# solar_returns/muntha_calculator.py

class MunthaCalculator:
    """
    Muntha progression calculator.
    Formula: (Natal Ascendant Sign Index + Age) % 12
    Where Aries = 0, Taurus = 1, etc.
    """

    def __init__(self):
        self.signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]

    def calculate(
        self,
        natal_ascendant_sign_index,
        age,
        return_ascendant_sign_index
    ):
        muntha_sign_index = (natal_ascendant_sign_index + age) % 12
        muntha_sign = self.signs[muntha_sign_index]
        
        # House in the return chart (relative to return ascendant)
        muntha_house = ((muntha_sign_index - return_ascendant_sign_index + 12) % 12) + 1

        return {
            "sign_index": muntha_sign_index,
            "sign": muntha_sign,
            "house": muntha_house
        }

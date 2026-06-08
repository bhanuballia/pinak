# solar_returns/muntha_calculator.py

class MunthaCalculator:
    """
    Muntha progression calculator.
    """

    def calculate(
        self,
        natal_ascendant,
        age
    ):
        return (
            natal_ascendant + age
        ) % 12

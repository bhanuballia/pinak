# relationships/shadbala/planetary_strength.py

from relationships.dignity_engine import (
    dignity_score
)

class PlanetaryStrengthEngine:

    def calculate(
        self,
        relationship
    ):

        base = dignity_score(
            relationship
        )

        return round(
            base * 1.6,
            2
        )

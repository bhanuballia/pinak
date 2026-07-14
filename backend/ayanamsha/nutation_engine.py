# ayanamsha/nutation_engine.py

from math import sin, radians


class NutationEngine:

    def calculate(
        self,
        moon_node
    ):

        return (
            9.2
            *
            sin(
                radians(moon_node)
            )
        ) / 3600

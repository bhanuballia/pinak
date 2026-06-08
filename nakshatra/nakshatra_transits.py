# nakshatra/nakshatra_transits.py

from nakshatra.nakshatra_engine import (
    NakshatraEngine
)

class NakshatraTransitEngine:

    def __init__(self):

        self.engine = NakshatraEngine()

    def transit_analysis(
        self,
        natal_longitude: float,
        transit_longitude: float
    ):

        natal = self.engine.calculate(
            natal_longitude
        )

        transit = self.engine.calculate(
            transit_longitude
        )

        return {

            "natal_nakshatra":
                natal["nakshatra"],

            "transit_nakshatra":
                transit["nakshatra"],

            "activation":
                natal["nakshatra"]
                ==
                transit["nakshatra"]
        }

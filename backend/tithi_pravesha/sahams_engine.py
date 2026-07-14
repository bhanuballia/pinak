# tithi_pravesha/sahams_engine.py

class SahamsEngine:

    def calculate(
        self,
        ascendant,
        moon
    ):

        return {

            "fortune_saham":
                (
                    ascendant
                    +
                    moon
                ) % 360

        }

# tithi_pravesha/lunar_phase_engine.py

class LunarPhaseEngine:

    def calculate(self, tithi):

        if tithi == 15:
            return "Purnima"

        if tithi == 30:
            return "Amavasya"

        if tithi < 15:
            return "Waxing Moon"

        return "Waning Moon"

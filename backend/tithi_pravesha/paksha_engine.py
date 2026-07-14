# tithi_pravesha/paksha_engine.py

class PakshaEngine:

    def calculate(self, tithi):

        if tithi <= 15:
            return "Shukla Paksha"

        return "Krishna Paksha"

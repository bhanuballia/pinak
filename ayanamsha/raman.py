# ayanamsha/raman.py

class RamanAyanamsha:

    BASE_2000 = 22.506

    def calculate(self, years):

        return (
            self.BASE_2000
            +
            (years * 50.29 / 3600)
        )

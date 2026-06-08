# ayanamsha/fagan_bradley.py

class FaganBradley:

    BASE_2000 = 24.740

    def calculate(self, years):

        return (
            self.BASE_2000
            +
            (years * 50.29 / 3600)
        )

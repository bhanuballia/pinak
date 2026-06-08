# ayanamsha/krishnamurti.py

class KrishnamurtiAyanamsha:

    BASE_2000 = 23.856111

    def calculate(self, years):

        return (
            self.BASE_2000
            +
            (years * 50.29 / 3600)
        )

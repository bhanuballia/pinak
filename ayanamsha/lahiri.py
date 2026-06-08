# ayanamsha/lahiri.py

class LahiriAyanamsha:

    BASE_2000 = 23.85675

    def calculate(self, years):

        return (
            self.BASE_2000
            +
            (years * 50.29 / 3600)
        )

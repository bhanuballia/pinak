class TithiEngine:

    def calculate(self, moon_deg, sun_deg):

        diff = (moon_deg - sun_deg) % 360

        return int(diff / 12) + 1

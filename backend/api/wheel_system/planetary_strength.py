# wheel_system/planetary_strength.py

class PlanetaryStrength:

    def calculate_strength(self, dignity_score, shadbala):

        return round(
            (dignity_score * 0.4) +
            (shadbala * 0.6),
            2
        )

# wheel_system/zodiac_divisions.py

from wheel_system.polar_math import PolarMath


class ZodiacDivisions:

    SIGNS = [
        "Ar", "Ta", "Ge", "Cn",
        "Le", "Vi", "Li", "Sc",
        "Sg", "Cp", "Aq", "Pi"
    ]

    def get_sign_boundaries(self):

        divisions = []

        for i in range(12):

            longitude = i * 30

            angle = PolarMath.zodiac_to_angle(longitude)

            divisions.append({
                "sign": self.SIGNS[i],
                "longitude": longitude,
                "angle": angle
            })

        return divisions

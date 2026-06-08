# wheel_system/polar_math.py

import math


class PolarMath:

    @staticmethod
    def zodiac_to_angle(longitude):
        """
        Convert zodiac longitude to SVG angle.
        Aries starts at top.
        """
        return (longitude - 90) % 360

    @staticmethod
    def polar_to_cartesian(cx, cy, radius, angle_deg):
        angle_rad = math.radians(angle_deg)

        x = cx + radius * math.cos(angle_rad)
        y = cy + radius * math.sin(angle_rad)

        return x, y

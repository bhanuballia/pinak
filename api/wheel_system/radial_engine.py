# wheel_system/radial_engine.py

from wheel_system.polar_math import PolarMath


class RadialEngine:

    def __init__(self, center_x=500, center_y=500):
        self.cx = center_x
        self.cy = center_y

    def get_planet_position(self, longitude, radius):

        angle = PolarMath.zodiac_to_angle(longitude)

        return PolarMath.polar_to_cartesian(
            self.cx,
            self.cy,
            radius,
            angle
        )

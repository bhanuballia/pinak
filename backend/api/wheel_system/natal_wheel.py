# wheel_system/natal_wheel.py

from wheel_system.radial_engine import RadialEngine


class NatalWheel:

    def __init__(self):
        self.engine = RadialEngine()

    def generate(self, natal_positions):

        result = {}

        for planet, longitude in natal_positions.items():

            x, y = self.engine.get_planet_position(
                longitude,
                radius=300
            )

            result[planet] = {
                "x": x,
                "y": y,
                "longitude": longitude
            }

        return result

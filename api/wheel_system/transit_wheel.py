# wheel_system/transit_wheel.py

from wheel_system.radial_engine import RadialEngine


class TransitWheel:

    def __init__(self):
        self.engine = RadialEngine()

    def generate(self, transit_positions):

        result = {}

        for planet, longitude in transit_positions.items():

            x, y = self.engine.get_planet_position(
                longitude,
                radius=420
            )

            result[planet] = {
                "x": x,
                "y": y,
                "longitude": longitude
            }

        return result

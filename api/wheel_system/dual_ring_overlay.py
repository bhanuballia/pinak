# wheel_system/dual_ring_overlay.py

from wheel_system.transit_wheel import TransitWheel
from wheel_system.natal_wheel import NatalWheel


class DualRingOverlay:

    def build_overlay(self, natal, transit):

        natal_data = NatalWheel().generate(natal)

        transit_data = TransitWheel().generate(transit)

        return {
            "natal": natal_data,
            "transit": transit_data
        }

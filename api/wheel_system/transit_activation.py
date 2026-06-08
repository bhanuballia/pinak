# wheel_system/transit_activation.py

class TransitActivation:

    def is_activated(self, natal_longitude, transit_longitude):

        diff = abs(transit_longitude - natal_longitude)

        if diff > 180:
            diff = 360 - diff

        return diff <= 5

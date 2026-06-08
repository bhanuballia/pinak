# astottaramsa/transit_activation.py

class TransitActivation:

    def activate(self, natal, transit):

        result = []

        for planet, sign in transit.items():

            if natal.get(planet) == sign:

                result.append({
                    "planet": planet,
                    "activated": True
                })

        return result

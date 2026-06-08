class TransitActivation:

    def activate(self, transit_data):

        result = []

        for planet, nakshatra in transit_data.items():

            result.append({
                "planet": planet,
                "nakshatra": nakshatra
            })

        return result

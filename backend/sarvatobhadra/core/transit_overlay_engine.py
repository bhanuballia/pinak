class TransitOverlayEngine:

    def generate(self, natal, transit):

        overlays = []

        for planet, sign in transit.items():

            overlays.append({
                "planet": planet,
                "transit_sign": sign,
                "natal_overlap":
                    natal.get(planet)
            })

        return overlays

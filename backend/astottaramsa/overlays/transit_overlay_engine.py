# astottaramsa/overlays/transit_overlay_engine.py

class TransitOverlayEngine:

    def generate(self, natal, transits):

        overlays = []

        for planet, sign in transits.items():

            overlays.append({
                "planet": planet,
                "natal": natal.get(planet),
                "transit": sign
            })

        return overlays

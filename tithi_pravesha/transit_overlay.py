# tithi_pravesha/transit_overlay.py

class TransitOverlay:

    def overlay(
        self,
        natal,
        transit
    ):

        return {

            "overlay_strength":
                abs(
                    natal - transit
                )

        }

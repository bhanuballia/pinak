# tithi_pravesha/yearly_activation.py

class YearlyActivation:

    def activate(
        self,
        dasha,
        transit
    ):

        return {

            "activated":
                dasha == transit

        }

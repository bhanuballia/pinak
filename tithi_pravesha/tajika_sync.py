# tithi_pravesha/tajika_sync.py

class TajikaSync:

    def synchronize(
        self,
        tajika_score,
        tithi_score
    ):

        return {

            "tajika_sync":
                (
                    tajika_score
                    +
                    tithi_score
                ) / 2

        }

# ayanamsha/divisional_alignment.py

class DivisionalAlignment:

    def adjust(
        self,
        longitude,
        division
    ):

        segment = 30 / division

        return int(
            longitude / segment
        )

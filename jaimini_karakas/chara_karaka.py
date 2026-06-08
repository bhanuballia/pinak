# jaimini_karakas/chara_karaka.py

class CharaKaraka:

    def assign(
        self,
        sorted_planets
    ):

        karakas = {}

        names = [

            "AK",
            "AmK",
            "BK",
            "MK",
            "PK",
            "GK",
            "DK"

        ]

        for idx, planet in enumerate(
            sorted_planets
        ):

            karakas[
                names[idx]
            ] = planet

        return karakas

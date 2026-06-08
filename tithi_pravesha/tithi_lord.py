# tithi_pravesha/tithi_lord.py

TITHI_LORDS = {

    1: "Sun",
    2: "Moon",
    3: "Mars",
    4: "Mercury",
    5: "Jupiter",
    6: "Venus",
    7: "Saturn"

}


class TithiLord:

    def get_lord(self, tithi):

        index = (
            ((tithi - 1) % 7) + 1
        )

        return {

            "tithi_lord":
                TITHI_LORDS[index]

        }

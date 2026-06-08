# jaimini_karakas/karaka_engine.py

KARAKAS = [

    "Atmakaraka",
    "Amatyakaraka",
    "Bhratrukaraka",
    "Matrukaraka",
    "Putrakaraka",
    "Gnatikaraka",
    "Darakaraka"

]


class KarakaEngine:

    def calculate(self, planets):

        """
        planets = {

            "Sun": 18.2,
            "Moon": 20.5,
            "Mars": 5.1,
            "Mercury": 11.7,
            "Jupiter": 2.9,
            "Venus": 29.1,
            "Saturn": 25.4

        }
        """

        sorted_planets = sorted(

            planets.items(),
            key=lambda x: x[1],
            reverse=True

        )

        result = {}

        for idx, item in enumerate(
            sorted_planets
        ):

            result[
                KARAKAS[idx]
            ] = {

                "planet": item[0],
                "degree": item[1]

            }

        return result

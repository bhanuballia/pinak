# sanghatta_chakra/tara_engine.py

TARAS = [

    "Janma",
    "Sampat",
    "Vipat",
    "Kshema",
    "Pratyari",
    "Sadhaka",
    "Vadha",
    "Mitra",
    "Param Mitra"

]


class TaraEngine:

    def calculate(
        self,
        natal,
        transit
    ):

        distance = (
            (
                transit - natal
            ) % 27
        ) + 1

        tara = (
            (distance - 1) % 9
        )

        return {

            "distance": distance,
            "tara": TARAS[tara]

        }

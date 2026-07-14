TARAS = [
    "Janma",
    "Sampat",
    "Vipat",
    "Kshema",
    "Pratyari",
    "Sadhaka",
    "Vadha",
    "Mitra",
    "Parama Mitra"
]


class TaraActivation:

    def calculate(self, birth_star, transit_star):

        diff = (transit_star - birth_star) % 9

        return TARAS[diff]

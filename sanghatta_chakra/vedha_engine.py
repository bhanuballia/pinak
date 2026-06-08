# sanghatta_chakra/vedha_engine.py

class VedhaEngine:

    DANGEROUS = [

        "Vipat",
        "Pratyari",
        "Vadha"

    ]

    def evaluate(self, tara):

        return {

            "danger":
                tara in self.DANGEROUS

        }

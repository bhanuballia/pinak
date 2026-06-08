# jaimini_karakas/darakaraka.py

class Darakaraka:

    def spouse_analysis(self, planet):

        spouse = {

            "Venus":
                "Romantic partner",

            "Saturn":
                "Mature spouse",

            "Mars":
                "Energetic spouse",

            "Moon":
                "Sensitive spouse"

        }

        return spouse.get(
            planet,
            "Balanced partner"
        )

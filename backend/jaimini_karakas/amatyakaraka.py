# jaimini_karakas/amatyakaraka.py

class Amatyakaraka:

    def career_path(self, planet):

        careers = {

            "Mercury":
                "Business & Communication",

            "Sun":
                "Government & Leadership",

            "Venus":
                "Arts & Luxury",

            "Saturn":
                "Engineering & Structure"

        }

        return careers.get(
            planet,
            "General profession"
        )

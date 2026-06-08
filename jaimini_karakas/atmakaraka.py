# jaimini_karakas/atmakaraka.py

class Atmakaraka:

    def analyze(self, planet):

        meanings = {

            "Sun":
                "Leadership destiny",

            "Moon":
                "Emotional evolution",

            "Mars":
                "Warrior karma",

            "Mercury":
                "Intellectual growth",

            "Jupiter":
                "Spiritual wisdom",

            "Venus":
                "Love refinement",

            "Saturn":
                "Karmic endurance"

        }

        return meanings.get(
            planet,
            "Unknown destiny"
        )

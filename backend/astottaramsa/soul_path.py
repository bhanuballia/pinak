# astottaramsa/soul_path.py

class SoulPath:

    def determine(self, atmakaraka_sign):

        paths = {
            "Pisces": "Spiritual Liberation",
            "Leo": "Leadership Evolution",
            "Scorpio": "Transformation"
        }

        return paths.get(
            atmakaraka_sign,
            "Balanced Soul Growth"
        )

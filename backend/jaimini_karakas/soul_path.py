# jaimini_karakas/soul_path.py

class SoulPath:

    def determine(self, ak):

        paths = {

            "Sun":
                "Soul seeks leadership",

            "Moon":
                "Soul seeks emotional peace",

            "Jupiter":
                "Soul seeks wisdom"

        }

        return paths.get(
            ak,
            "Balanced karmic path"
        )

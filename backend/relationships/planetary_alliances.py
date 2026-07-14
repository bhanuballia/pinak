# relationships/planetary_alliances.py

class PlanetaryAllianceEngine:

    def alliance_score(
        self,
        relationship
    ):

        scores = {

            "Great Friend": 100,
            "Friend": 80,
            "Neutral": 50,
            "Enemy": 25,
            "Great Enemy": 10
        }

        return scores.get(
            relationship,
            50
        )

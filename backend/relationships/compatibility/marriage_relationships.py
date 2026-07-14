# relationships/compatibility/marriage_relationships.py

class MarriageRelationshipEngine:

    def compatibility(
        self,
        venus_rel,
        moon_rel
    ):

        score = 0

        if venus_rel in [
            "Great Friend",
            "Friend"
        ]:
            score += 50

        if moon_rel in [
            "Great Friend",
            "Friend"
        ]:
            score += 50

        return score

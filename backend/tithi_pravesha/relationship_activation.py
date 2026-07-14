# tithi_pravesha/relationship_activation.py

class RelationshipActivation:

    def analyze(
        self,
        venus,
        seventh_house
    ):

        score = (
            venus
            +
            seventh_house
        ) / 2

        return {

            "relationship_score":
                score

        }

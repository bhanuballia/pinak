# sanghatta_chakra/hospitalization_risk.py

class HospitalizationRisk:

    def evaluate(

        self,
        saturn,
        eighth_house

    ):

        score = 0

        if saturn:
            score += 50

        if eighth_house:
            score += 50

        return {

            "hospitalization_risk":
                score

        }

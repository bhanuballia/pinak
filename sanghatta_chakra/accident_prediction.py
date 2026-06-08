# sanghatta_chakra/accident_prediction.py

class AccidentPrediction:

    def evaluate(

        self,
        mars_affliction,
        vadha

    ):

        score = 0

        if mars_affliction:
            score += 60

        if vadha:
            score += 40

        return {

            "accident_risk": score

        }

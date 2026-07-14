# sanghatta_chakra/emotional_pressure.py

class EmotionalPressure:

    def evaluate(

        self,
        moon_affliction,
        saturn

    ):

        score = 0

        if moon_affliction:
            score += 60

        if saturn:
            score += 40

        return {

            "emotional_pressure":
                score

        }

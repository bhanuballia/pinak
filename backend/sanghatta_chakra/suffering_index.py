# sanghatta_chakra/suffering_index.py

class SufferingIndex:

    def calculate(
        self,
        saturn,
        mars,
        rahu
    ):

        score = (

            saturn * 0.4
            +
            mars * 0.35
            +
            rahu * 0.25

        )

        return round(score, 2)

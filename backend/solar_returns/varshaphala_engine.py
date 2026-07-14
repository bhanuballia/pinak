# solar_returns/varshaphala_engine.py

class VarshaphalaEngine:
    """
    Complete annual prediction engine.
    """

    def analyze(
        self,
        chart
    ):
        score = 0

        if chart.get("10th_house", 0) > 25:
            score += 20

        if chart.get("11th_house", 0) > 25:
            score += 20

        return {
            "yearly_score":
                score
        }

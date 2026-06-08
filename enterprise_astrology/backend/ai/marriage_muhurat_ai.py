# ai/marriage_muhurat_ai.py

class MarriageMuhuratAI:

    def evaluate(
        self,
        tara_bala,
        chandrabala,
        venus_strength
    ):

        score = (
            tara_bala
            +
            chandrabala
            +
            venus_strength
        ) / 3

        if score >= 80:

            return {
                "status":
                    "Excellent Muhurat",
                "score":
                    round(score, 2)
            }

        return {
            "status":
                "Average Muhurat",
            "score":
                round(score, 2)
            }

class MuhurtaAI:

    def select_best_time(self, candidates):

        best = max(
            candidates,
            key=lambda x: x["score"]
        )

        return {
            "best_muhurta": best
        }

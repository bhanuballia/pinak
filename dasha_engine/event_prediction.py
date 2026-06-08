class EventPredictionEngine:

    def predict(self, mahadasha, antardasha, chart_data):

        predictions = {
            "career": [],
            "marriage": [],
            "wealth": [],
            "health": []
        }

        md = mahadasha.lower()
        ad = antardasha.lower()

        if md == "jupiter":
            predictions["career"].append(
                "Career expansion and guidance opportunities likely"
            )

            predictions["wealth"].append(
                "Financial stability and long-term gains possible"
            )

        if ad == "venus":
            predictions["marriage"].append(
                "Relationship opportunities increase"
            )

        if md == "saturn":
            predictions["career"].append(
                "Slow but stable professional growth"
            )

        if ad == "rahu":
            predictions["health"].append(
                "Mental stress and confusion possible"
            )

        return predictions

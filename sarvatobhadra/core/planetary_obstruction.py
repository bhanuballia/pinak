MALEFICS = [
    "Saturn",
    "Mars",
    "Rahu",
    "Ketu"
]


class PlanetaryObstruction:

    def calculate(self, activations):

        result = []

        for item in activations:

            severity = "normal"

            if item["planet"] in MALEFICS:
                severity = "high"

            result.append({
                "planet": item["planet"],
                "severity": severity
            })

        return result

class MedicalAstrologyAI:

    def analyze(self, transits):

        risks = []

        for item in transits:

            if item["planet"] == "Saturn":

                risks.append(
                    "Chronic health sensitivity"
                )

            if item["planet"] == "Mars":

                risks.append(
                    "Inflammation risk"
                )

        return risks

# astottaramsa/profession_analysis.py

class ProfessionAnalysis:

    CAREER_SIGNS = [
        "Capricorn",
        "Virgo",
        "Aquarius"
    ]

    def analyze(self, sign):

        if sign in self.CAREER_SIGNS:

            return {
                "career_strength": "High"
            }

        return {
            "career_strength": "Moderate"
        }

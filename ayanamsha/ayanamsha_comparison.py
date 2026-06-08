# ayanamsha/ayanamsha_comparison.py

class AyanamshaComparison:

    def compare(self, systems):

        result = []

        for name, value in systems.items():

            result.append({
                "system": name,
                "ayanamsha": value
            })

        return result

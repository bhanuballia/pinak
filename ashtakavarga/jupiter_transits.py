# ashtakavarga/jupiter_transits.py
# Analyzes Jupiter transit quality using Samudaya Ashtakavarga.

class JupiterTransitAnalyzer:

    def analyze(self, jupiter_sign, samudaya):
        """
        Evaluate the prosperity potential of Jupiter's transit.

        Args:
            jupiter_sign (int): 0-indexed sign Jupiter is transiting
            samudaya (dict): Samudaya AV points per sign

        Returns:
            dict: { "wealth": str, "prosperity": "HIGH" | "AVERAGE" }
        """
        points = samudaya.get(jupiter_sign, 0)

        if points >= 28:
            return {
                "wealth": "Strong Growth",
                "prosperity": "HIGH"
            }

        return {
            "wealth": "Moderate",
            "prosperity": "AVERAGE"
        }

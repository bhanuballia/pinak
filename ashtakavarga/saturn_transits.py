# ashtakavarga/saturn_transits.py
# Analyzes Saturn transit quality using Samudaya Ashtakavarga.

class SaturnTransitAnalyzer:

    def analyze(self, saturn_sign, samudaya):
        """
        Evaluate the difficulty of Saturn's transit through a sign.

        Args:
            saturn_sign (int): 0-indexed sign Saturn is transiting
            samudaya (dict): Samudaya AV points per sign

        Returns:
            dict: { "result": str, "risk": "HIGH" | "LOW" }
        """
        points = samudaya.get(saturn_sign, 0)

        if points < 20:
            return {
                "result": "Difficult Saturn Transit",
                "risk": "HIGH"
            }

        return {
            "result": "Supportive Saturn Transit",
            "risk": "LOW"
        }

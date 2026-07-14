# ashtakavarga/house_strength.py
# Classifies house strength based on Samudaya AV bindus.

class HouseStrength:

    def classify(self, bindus):
        """
        Classify house strength based on total bindu count.

        Args:
            bindus (int): total Samudaya AV points for the house/sign

        Returns:
            str: "Powerful" | "Strong" | "Average" | "Weak"
        """
        if bindus >= 30:
            return "Powerful"
        elif bindus >= 25:
            return "Strong"
        elif bindus >= 20:
            return "Average"
        return "Weak"

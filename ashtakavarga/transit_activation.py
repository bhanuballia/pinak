# ashtakavarga/transit_activation.py
# Evaluates transit quality based on Samudaya bindus in a sign.

class TransitActivation:

    def evaluate(self, transit_sign, samudaya_points):
        """
        Rate the quality of a planetary transit through a sign.

        Args:
            transit_sign (int): 0-indexed sign number
            samudaya_points (dict): output of SamudayaAshtakavarga.calculate()

        Returns:
            str: "Excellent" | "Good" | "Average" | "Difficult"
        """
        points = samudaya_points.get(transit_sign, 0)

        if points >= 30:
            return "Excellent"
        elif points >= 25:
            return "Good"
        elif points >= 20:
            return "Average"
        return "Difficult"

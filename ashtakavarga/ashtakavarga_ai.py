# ashtakavarga/ashtakavarga_ai.py
# AI-style natural language interpretation of house AV scores.

class AshtakavargaAI:

    def interpret(self, house, points):
        """
        Generate a natural language interpretation for a house's bindu count.

        Args:
            house (int): house number (1–12)
            points (int): Samudaya AV bindus for the house

        Returns:
            str: interpretive statement
        """
        if points >= 30:
            return f"House {house} is highly activated."
        if points < 20:
            return f"House {house} requires caution."
        return f"House {house} has balanced karma."

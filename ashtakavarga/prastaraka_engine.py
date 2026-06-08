# ashtakavarga/prastaraka_engine.py
# Prastaraka (expanded matrix) engine — unfolds Bhinnashtakavarga into a 2D matrix.

class PrastarakaEngine:

    def expand(self, bhinna):
        """
        Convert Bhinnashtakavarga dict into a 2D list (matrix).
        Each row is one planet's bindu row across 12 signs.

        Args:
            bhinna (dict): output of Bhinnashtakavarga.calculate()

        Returns:
            list[list[int]]: planet x sign bindu matrix
        """
        matrix = []
        for planet in bhinna:
            row = [bhinna[planet][sign] for sign in range(12)]
            matrix.append(row)
        return matrix

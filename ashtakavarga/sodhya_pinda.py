# ashtakavarga/sodhya_pinda.py
# Calculates Sodhya Pinda — the average bindu score (advanced strength indicator).

class SodhyaPinda:

    def calculate(self, samudaya):
        """
        Compute the average bindu score across all 12 signs.

        Args:
            samudaya (dict): Samudaya AV points per sign

        Returns:
            float: average bindus per sign (Sodhya Pinda)
        """
        total = sum(samudaya.values())
        return round(total / 12, 2)

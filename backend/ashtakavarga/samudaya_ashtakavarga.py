# ashtakavarga/samudaya_ashtakavarga.py
# Computes the total combined Ashtakavarga (Samudaya AV) across all planets.

class SamudayaAshtakavarga:

    def calculate(self, bhinna_data):
        """
        Sum bindu scores across all planets for each sign.

        Args:
            bhinna_data (dict): output of Bhinnashtakavarga.calculate()

        Returns:
            dict: { sign_index(0-11): total_bindus }
        """
        samudaya = {}

        for sign in range(12):
            total = sum(bhinna_data[planet][sign] for planet in bhinna_data)
            samudaya[sign] = total

        return samudaya

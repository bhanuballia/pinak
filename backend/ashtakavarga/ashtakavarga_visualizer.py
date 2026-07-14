# ashtakavarga/ashtakavarga_visualizer.py
# Formats Samudaya AV data into a frontend-ready list.

from ashtakavarga.constants.signs import SIGNS


class AshtakavargaVisualizer:

    def prepare(self, samudaya):
        """
        Convert Samudaya AV dict to a list of sign-point objects for the frontend.

        Args:
            samudaya (dict): { sign_index(0-11): total_bindus }

        Returns:
            list[dict]: [{ "sign": str, "points": int }, ...]
        """
        data = []
        for sign_index, points in samudaya.items():
            data.append({
                "sign": SIGNS[sign_index] if sign_index < len(SIGNS) else str(sign_index),
                "points": points
            })
        return data

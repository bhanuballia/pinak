# nakshatra_advanced/heatmaps/nakshatra_heatmap.py

import numpy as np

class NakshatraHeatmap:

    def build_matrix(
        self,
        activations: list
    ):

        matrix = np.zeros((27, 27))

        for row in activations:

            src = row["source"]
            dst = row["target"]
            score = row["score"]

            matrix[src][dst] = score

        return matrix

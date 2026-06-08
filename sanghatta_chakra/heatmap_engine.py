# sanghatta_chakra/heatmap_engine.py

import numpy as np


class HeatmapEngine:

    def build(self, activations):

        matrix = np.zeros((12, 12))

        for item in activations:

            matrix[
                item["x"]
            ][
                item["y"]
            ] = item["score"]

        return matrix

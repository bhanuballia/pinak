# astottaramsa/overlays/activation_heatmap.py

import numpy as np


class ActivationHeatmap:

    def build(self, activations):

        matrix = np.zeros((12, 12))

        for item in activations:

            x = item.get("x", 0)
            y = item.get("y", 0)
            
            if 0 <= x < 12 and 0 <= y < 12:
                matrix[x][y] += item.get("strength", 0)

        return matrix

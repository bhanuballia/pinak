import numpy as np


class ActivationHeatmap:

    def build(self, activations):

        matrix = np.zeros((9, 9))

        for item in activations:

            row = item["row"]
            col = item["col"]

            matrix[row][col] += 1

        return matrix

# tithi_pravesha/yearly_heatmap.py

import numpy as np


class YearlyHeatmap:

    def generate(self, values):

        matrix = np.zeros((12, 12))

        idx = 0

        for value in values:

            row = idx // 12
            col = idx % 12

            matrix[row][col] = value

            idx += 1

        return matrix

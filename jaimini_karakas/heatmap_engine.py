# jaimini_karakas/heatmap_engine.py

import numpy as np


class HeatmapEngine:

    def build(self, values):

        matrix = np.zeros((7, 7))

        idx = 0

        for v in values:

            row = idx // 7
            col = idx % 7

            matrix[row][col] = v

            idx += 1

        return matrix

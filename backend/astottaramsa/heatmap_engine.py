# astottaramsa/heatmap_engine.py

import numpy as np


class HeatmapEngine:

    def generate(self, planets):

        matrix = np.zeros((3, 3))

        idx = 0

        for p in planets:

            row = idx // 3
            col = idx % 3

            matrix[row][col] = p.get("strength", 50)

            idx += 1
            if idx >= 9:
                break

        return matrix

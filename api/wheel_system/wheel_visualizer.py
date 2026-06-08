# wheel_system/wheel_visualizer.py

import matplotlib.pyplot as plt
import matplotlib.patches as patches
from wheel_system.zodiac_divisions import ZodiacDivisions


class WheelVisualizer:

    def draw_base_wheel(self):

        fig, ax = plt.subplots(figsize=(10, 10))

        outer_circle = patches.Circle(
            (0, 0),
            radius=1,
            fill=False
        )

        ax.add_patch(outer_circle)

        zodiac = ZodiacDivisions()

        for div in zodiac.get_sign_boundaries():

            print(div)

        plt.axis("equal")

        plt.show()

import matplotlib.pyplot as plt


class TransitHeatmap:

    def draw(self, scores):

        plt.figure(figsize=(8, 6))

        plt.imshow([scores])

        plt.colorbar()

        plt.title("Transit Activation Heatmap")

        plt.show()

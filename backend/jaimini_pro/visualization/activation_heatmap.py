# jaimini_pro/visualization/activation_heatmap.py
import matplotlib.pyplot as plt
class ActivationHeatmap:
    def draw(self, scores):
        plt.figure(figsize=(8, 4))
        plt.imshow([scores])
        plt.colorbar()
        plt.title("Karmic Activation Heatmap")
        plt.show()

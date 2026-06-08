# jaimini_system/dasha_visualizer.py

import matplotlib.pyplot as plt

class DashaVisualizer:
    def plot(self, dasha):
        signs = [str(d["sign"]) for d in dasha]
        years = [d.get("years", 1) for d in dasha]
        plt.figure(figsize=(10, 5))
        plt.bar(signs, years)
        plt.title("Jaimini Dasha Timeline")
        plt.xlabel("Signs")
        plt.ylabel("Years")
        plt.show()

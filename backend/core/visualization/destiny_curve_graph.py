import matplotlib.pyplot as plt
from core.visualization.graph_utils import save_path

def plot_destiny_curve(curve):

    years = [c["year"] for c in curve]
    scores = [c["score"] for c in curve]

    path = save_path("destiny_curve")

    plt.figure(figsize=(8,4))
    plt.plot(years, scores, marker="o")
    plt.title("Destiny Score Timeline")
    plt.xlabel("Year")
    plt.ylabel("Destiny Score")
    plt.grid(True)

    plt.savefig(path)
    plt.close()

    return path

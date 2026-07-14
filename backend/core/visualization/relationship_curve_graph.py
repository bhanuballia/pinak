import matplotlib.pyplot as plt
from core.visualization.graph_utils import save_path

def plot_relationship_curve(timeline):

    years = []
    energy = []

    for y in timeline:
        val = 0
        for e in y.get("events", []):
            if e["type"] == "relationship_peak":
                val += 2
        years.append(y["year"])
        energy.append(val)

    path = save_path("relationship_curve")

    plt.figure(figsize=(8,4))
    plt.plot(years, energy)
    plt.title("Relationship Energy Timeline")
    plt.grid(True)

    plt.savefig(path)
    plt.close()

    return path

import matplotlib.pyplot as plt
from core.visualization.graph_utils import save_path

def plot_risk_heatmap(timeline):

    years = []
    risk = []

    for y in timeline:
        val = 0
        for e in y.get("events", []):
            if e["type"] == "health_caution":
                val += 1
        years.append(y["year"])
        risk.append(val)

    path = save_path("risk_heatmap")

    plt.figure(figsize=(8,2))
    plt.bar(years, risk)
    plt.title("Challenge / Risk Periods")

    plt.savefig(path)
    plt.close()

    return path

import matplotlib.pyplot as plt
from core.visualization.graph_utils import save_path

def plot_career_curve(timeline):

    years = []
    values = []

    for y in timeline:
        score = 0
        for e in y.get("events", []):
            if e["type"] == "career_growth":
                score += 3
        years.append(y["year"])
        values.append(score)

    path = save_path("career_curve")

    plt.figure(figsize=(8,4))
    plt.plot(years, values)
    plt.title("Career Growth Potential")
    plt.grid(True)

    plt.savefig(path)
    plt.close()

    return path

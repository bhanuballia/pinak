# solar_returns/progression_heatmap.py

def get_heatmap_color(
    score
):
    if score >= 80:
        return "green"

    elif score >= 50:
        return "yellow"

    return "red"

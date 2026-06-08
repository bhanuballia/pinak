# ashtakavarga/transit_heatmap.py
# Color coding for transit heatmap visualization.

def heatmap_color(points):
    """
    Map Samudaya AV bindu count to a display color.

    Args:
        points (int): Samudaya AV bindus for a sign

    Returns:
        str: "green" | "yellow" | "red"
    """
    if points >= 30:
        return "green"
    elif points >= 25:
        return "yellow"
    return "red"

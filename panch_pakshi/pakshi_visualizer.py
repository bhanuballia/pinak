# panch_pakshi/pakshi_visualizer.py

def render_row(data):

    return (
        f"{data['bird']} | "
        f"{data['activity']} | "
        f"{data['relationship']} | "
        f"{data['start']} → "
        f"{data['end']}"
    )

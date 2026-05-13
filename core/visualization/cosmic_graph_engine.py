from core.visualization.destiny_curve_graph import plot_destiny_curve
from core.visualization.career_curve_graph import plot_career_curve
from core.visualization.relationship_curve_graph import plot_relationship_curve
from core.visualization.risk_heatmap_graph import plot_risk_heatmap


def run_cosmic_graph_engine(report_data):

    life_path = report_data.get("life_path", {})
    timeline = report_data.get("omniscient_timeline", {}).get("omniscient_timeline", [])

    graphs = {}

    # Destiny curve
    if life_path.get("destiny_curve"):
        graphs["destiny_curve"] = plot_destiny_curve(
            life_path["destiny_curve"]
        )

    # Career graph
    graphs["career_curve"] = plot_career_curve(timeline)

    # Relationship graph
    graphs["relationship_curve"] = plot_relationship_curve(timeline)

    # Risk heatmap
    graphs["risk_heatmap"] = plot_risk_heatmap(timeline)

    return graphs

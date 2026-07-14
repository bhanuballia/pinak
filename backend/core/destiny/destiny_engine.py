from .graph_builder import build_destiny_graph
from .svg_chart_render import render_destiny_svg

def run_destiny_engine(report_data):

    karma = report_data.get("karma_timeline",[])

    if not karma:
        return report_data

    graphs = build_destiny_graph(karma)

    report_data["destiny_graphs"] = graphs

    # Generate SVG for Career graph (PDF usage)
    try:
        svg_path = render_destiny_svg(
            graphs["career"],
            "reports/images/destiny_career.svg"
        )
        report_data.setdefault("chart_images",{})["destiny_career"] = svg_path
    except:
        pass

    return report_data

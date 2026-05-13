from __future__ import annotations
import svgwrite
import os


def render_destiny_timeline(
    destiny_graph: list,
    out_svg: str,
    size: int = 600,
    height: int = 300,
    theme: str = "gold",
):
    """
    Render Destiny Graph Timeline into SVG.

    destiny_graph example:
    [
        {"year":2025,"value":60},
        {"year":2026,"value":72},
        ...
    ]
    """

    os.makedirs(os.path.dirname(out_svg) or ".", exist_ok=True)

    # Theme colors
    if theme == "gold":
        line_color = "#c9a227"
        grid_color = "#e6d7a5"
        text_color = "#444"
    else:
        line_color = "#222"
        grid_color = "#ddd"
        text_color = "#333"

    dwg = svgwrite.Drawing(out_svg, size=(size, height))
    dwg.add(dwg.rect(insert=(0, 0), size=(size, height), fill="white"))

    if not destiny_graph:
        dwg.add(dwg.text("No Timeline Data", insert=(20, 40)))
        dwg.save()
        return out_svg

    # margins
    left = 60
    right = size - 40
    top = 40
    bottom = height - 40

    # draw grid lines
    for i in range(5):
        y = top + i * (bottom - top) / 4
        dwg.add(
            dwg.line(
                start=(left, y),
                end=(right, y),
                stroke=grid_color,
                stroke_width=1,
            )
        )

    years = [p["year"] for p in destiny_graph]
    values = [p["value"] for p in destiny_graph]

    min_year = min(years)
    max_year = max(years)

    def scale_x(year):
        return left + (year - min_year) / (max_year - min_year) * (right - left)

    def scale_y(value):
        return bottom - (value / 100.0) * (bottom - top)

    # Build polyline points
    pts = [(scale_x(p["year"]), scale_y(p["value"])) for p in destiny_graph]

    dwg.add(
        dwg.polyline(
            pts,
            stroke=line_color,
            fill="none",
            stroke_width=3,
        )
    )

    # draw points
    for x, y in pts:
        dwg.add(dwg.circle(center=(x, y), r=4, fill=line_color))

    # labels
    for p in destiny_graph:
        dwg.add(
            dwg.text(
                str(p["year"]),
                insert=(scale_x(p["year"]) - 10, bottom + 20),
                font_size=12,
                fill=text_color,
            )
        )

    dwg.add(
        dwg.text(
            "Destiny Timeline",
            insert=(left, 20),
            font_size=16,
            fill=text_color,
            font_weight="bold",
        )
    )

    dwg.save()

    return out_svg

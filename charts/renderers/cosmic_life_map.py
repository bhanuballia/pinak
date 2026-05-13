from __future__ import annotations
import svgwrite
import math
import os


def render_cosmic_life_map(
    scores: dict,
    out_svg: str,
    size: int = 500,
    theme: str = "gold",
):
    """
    Draws radial life wheel using domain scores.
    """

    os.makedirs(os.path.dirname(out_svg) or ".", exist_ok=True)

    cx = size / 2
    cy = size / 2
    radius = size * 0.35

    if theme == "gold":
        line_color = "#c9a227"
        text_color = "#5a4632"
    else:
        line_color = "#333"
        text_color = "#333"

    dwg = svgwrite.Drawing(out_svg, size=(size, size))
    dwg.add(dwg.rect(insert=(0, 0), size=(size, size), fill="white"))

    labels = list(scores.keys())
    values = list(scores.values())
    n = len(labels)

    # Draw outer circle
    dwg.add(dwg.circle(center=(cx, cy), r=radius, stroke="#ddd", fill="none"))

    pts = []

    for i, label in enumerate(labels):
        angle = (2 * math.pi / n) * i - math.pi / 2

        # axis line
        ax = cx + math.cos(angle) * radius
        ay = cy + math.sin(angle) * radius
        dwg.add(dwg.line((cx, cy), (ax, ay), stroke="#eee"))

        # label
        lx = cx + math.cos(angle) * (radius + 20)
        ly = cy + math.sin(angle) * (radius + 20)
        dwg.add(
            dwg.text(
                label.title(),
                insert=(lx, ly),
                text_anchor="middle",
                font_size=12,
                fill=text_color,
            )
        )

        # value point
        r_scaled = radius * (values[i] / 100.0)
        px = cx + math.cos(angle) * r_scaled
        py = cy + math.sin(angle) * r_scaled
        pts.append((px, py))

    # draw polygon
    dwg.add(
        dwg.polygon(
            pts,
            fill="#e8d9a5",
            stroke=line_color,
            stroke_width=3,
        )
    )

    dwg.save()
    return out_svg

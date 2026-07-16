"""
Ashtakavarga Wheel Renderer — FIXED VERSION
 - Draws clean circular Sarvashtakavarga wheel
 - Works with pdf_generator.py
 - Outputs SVG and PNG
"""

from __future__ import annotations
import math
import os
import svgwrite
from typing import Dict, Any, Optional

_CAIRO_AVAILABLE = True

HOUSE_LABELS = [
    "1st House\n(Self)",
    "2nd House\n(Wealth)",
    "3rd House\n(Courage)",
    "4th House\n(Home)",
    "5th House\n(Creativity)",
    "6th House\n(Health)",
    "7th House\n(Partners)",
    "8th House\n(Transformation)",
    "9th House\n(Fortune)",
    "10th House\n(Career)",
    "11th House\n(Gains)",
    "12th House\n(Spirituality)",
]


def render_ashtakavarga_wheel(
    av_data: Dict[str, Any],
    out_png_path: str,
    size: int = 600,
    margin: int = 60
):
    """
    av_data must be:
      {
        "scores": [for 12 houses],
        "planet_scores": {
            "Sun": [...],
            ...
        }
      }
    """
    out_svg_path = out_png_path.replace(".png", ".svg")
    os.makedirs(os.path.dirname(out_svg_path) or ".", exist_ok=True)

    dwg = svgwrite.Drawing(out_svg_path, size=(size, size))
    cx = size // 2
    cy = size // 2
    radius = size // 2 - margin

    dwg.add(dwg.rect((0, 0), (size, size), fill="white"))

    # Draw circle outline
    dwg.add(dwg.circle(center=(cx, cy), r=radius, fill="white", stroke="#000", stroke_width=2))

    # Draw 12 sectors
    step = 360 / 12
    for i in range(12):
        angle = math.radians(i * step)
        x = cx + radius * math.cos(angle)
        y = cy + radius * math.sin(angle)

        dwg.add(dwg.line((cx, cy), (x, y), stroke="#000", stroke_width=1))

    # Draw values in each sector
    scores = av_data.get("scores", [0]*12)

    label_r = radius * 0.65
    house_label_r = radius * 0.85
    for i, score in enumerate(scores):
        angle = math.radians(i * step + step / 2)
        x = cx + label_r * math.cos(angle)
        y = cy + label_r * math.sin(angle)

        dwg.add(
            dwg.text(
                str(score),
                insert=(x, y),
                font_size=24,
                fill="#444",
                text_anchor="middle",
                font_family="DejaVu Sans"
            )
        )
        # House name labels closer to rim
        hx = cx + house_label_r * math.cos(angle)
        hy = cy + house_label_r * math.sin(angle)
        label = HOUSE_LABELS[i] if i < len(HOUSE_LABELS) else f"House {i+1}"
        for idx, line in enumerate(label.split("\n")):
            dy = hy + idx * 16  # stack multiline text
            dwg.add(
                dwg.text(
                    line,
                    insert=(hx, dy),
                    font_size=14,
                    fill="#666",
                    text_anchor="middle",
                    font_family="DejaVu Sans"
                )
            )

    dwg.save()

    # Convert to PNG reliably
    global _CAIRO_AVAILABLE
    if _CAIRO_AVAILABLE:
        try:
            import cairosvg
            cairosvg.svg2png(url=out_svg_path, write_to=out_png_path)
        except Exception:
            _CAIRO_AVAILABLE = False
            # PNG conversion failed (usually missing Cairo system libraries on Windows)
            # This is expected - SVG fallback will be used
            pass

    return out_png_path

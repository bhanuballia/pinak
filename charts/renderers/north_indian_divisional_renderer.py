"""
North Indian Divisional Chart Renderer (D9, D10, D60, etc.)
 - Fully compatible with pdf_generator.py
 - SVG + PNG rendering
 - Clean simple layout (same style as Rasi chart)
"""

from __future__ import annotations
import os
from typing import Dict, Any, Optional

# Reuse the full-featured North Indian Rāśi renderer so that divisional
# charts (D9, D10, etc.) look identical in style and geometry to D1.
from charts.renderers.north_indian_rasi_renderer import render_north_indian_chart


def render_divisional_chart(
    chart_model: Dict[str, Any],
    out_svg_path: str,
    size: int = 600,
    width: Optional[int] = None,
    height: Optional[int] = None,
    margin: int = 40,
    planet_colors: Optional[Dict[str, str]] = None,
    to_png: Optional[str] = None,
) -> str:
    """
    Render a divisional chart (D9, D10, etc.) using the exact same
    North‑Indian geometry, gradient, and planet layout as the main
    Rāśi renderer.

    This is a thin wrapper over render_north_indian_chart so that
    pdf_generator.py can call a dedicated function for divisional charts
    while the look-and-feel stays perfectly consistent with D1.
    """
    # Ensure output directories exist (mirrors behaviour of the main renderer)
    os.makedirs(os.path.dirname(out_svg_path) or ".", exist_ok=True)
    if to_png:
        os.makedirs(os.path.dirname(to_png) or ".", exist_ok=True)

    # Use the same 3:2 aspect ratio as the main D1 renderer so that
    # D9/D10 layouts match the North‑Indian Rāśi chart visually in PDFs.
    # For the default size=600 this gives 800x400 (or similar), matching D1.
    # If width/height are explicitly provided, use those instead.
    if width is None:
        width = int(size * 4 / 3)
    if height is None:
        height = int(size * 8 / 9)

    return render_north_indian_chart(
        chart_model,
        out_svg_path,
        size=size,
        width=width,
        height=height,
        margin=margin,
        include_signs=False,
        planet_colors=planet_colors,
        to_png=to_png,
    )

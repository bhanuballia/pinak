# charts/renderers/rasi_chart_renderer.py
"""
North Indian Style Vedic Astrology Chart Renderer
Wrapper that delegates to render_north_indian_chart to ensure identical layout with navamsa chart.
"""
from __future__ import annotations
from typing import Dict, Any, Optional

# Import the main renderer to ensure identical output
from charts.renderers.north_indian_rasi_renderer import render_north_indian_chart


def render_rasi_svg(
    chart_model: Dict[str, Any],
    out_path: str,
    size: int = 600,
    width: Optional[int] = None,
    height: Optional[int] = None,
    margin: int = 40,
    include_signs: bool = True,
    to_png: Optional[str] = None,
) -> str:
    """
    Render North Indian style chart with polygon-based houses, gradient fill,
    and circular planet placement. Matches the layout of navamsa chart exactly.
    
    This function is a wrapper around render_north_indian_chart to ensure
    both rasi and navamsa charts use the same renderer and produce identical layouts.
    
    chart_model must have .houses mapping: house_no -> {"sign_name":..., "planets":[...]}
    """
    # Delegate to render_north_indian_chart to ensure identical output
    return render_north_indian_chart(
        chart_model=chart_model,
        out_svg_path=out_path,
        size=size,
        width=width,
        height=height,
        margin=margin,
        include_signs=include_signs,
        to_png=to_png,
    )

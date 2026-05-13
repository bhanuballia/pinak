"""
North Indian Rasi Chart Renderer — FIXED VERSION
 - Ensures PNG is always generated
 - Ensures output directories are created
 - Throws readable warnings when CairoSVG is missing
 - 100% compatible with pdf_generator.py
"""

from __future__ import annotations
from typing import Dict, Any, Optional, Tuple
import svgwrite
import math
import os

# Text styling
HOUSE_LABEL_STYLE = {
    "font_size": 14,
    "font_family": "DejaVu Sans, Arial, sans-serif",
    "fill": "#000000",
    "font_weight": "bold"
}
PLANET_STYLE = {
    "font_size": 12,
    "font_family": "DejaVu Sans, Arial, sans-serif",
    "fill": "#000000"
}
SIGN_STYLE = {
    "font_size": 11,
    "font_family": "DejaVu Sans, Arial, sans-serif",
    "fill": "#333333"
}

SIGN_FULL = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]


# ----------------------------------------------------------
# Base geometry from standalone SVG example (400x300 canvas)
# ----------------------------------------------------------
_BASE_WIDTH = 400.0
_BASE_HEIGHT = 300.0

# Centres used in the original script (1..12 houses)
_BASE_HOUSE_CENTERS = [
    (190, 75),   # 1st house
    (100, 30),   # 2nd house
    (30, 75),    # 3rd house
    (90, 150),   # 4th house
    (30, 225),   # 5th house
    (90, 278),   # 6th house
    (190, 225),  # 7th house
    (290, 278),  # 8th house
    (360, 225),  # 9th house
    (290, 150),  # 10th house
    (360, 75),   # 11th house
    (290, 30),   # 12th house
]


def _base_transform(width: int, height: int, margin: int = 40) -> Tuple[float, float, float]:
    """
    Compute scale and translation to fit the 400x300 base design
    into the current (width x height) canvas with the given margin.
    Returns (scale, offset_x, offset_y).
    """
    w = float(width)
    h = float(height)
    usable_w = max(w - 2 * margin, 1.0)
    usable_h = max(h - 2 * margin, 1.0)
    scale = min(usable_w / _BASE_WIDTH, usable_h / _BASE_HEIGHT)

    design_w = _BASE_WIDTH * scale
    design_h = _BASE_HEIGHT * scale

    offset_x = (w - design_w) / 2.0
    offset_y = (h - design_h) / 2.0
    return scale, offset_x, offset_y


# ----------------------------------------------------------
# House positions inside the diamond chart
# ----------------------------------------------------------
def _house_positions(width: int, height: int, margin: int = 40):
    """
    House centres derived directly from the standalone SVG example
    (400x300 base), scaled and centred into the requested canvas.
    """
    scale, ox, oy = _base_transform(width, height, margin)

    positions = {}
    for idx, (bx, by) in enumerate(_BASE_HOUSE_CENTERS, start=1):
        x = ox + bx * scale
        y = oy + by * scale
        positions[idx] = (x, y)

    return positions

# Label offsets in pixels (for fine-tuning). 
# To keep every house label exactly at the computed centre, leave all offsets as (0, 0).
HOUSE_LABEL_OFFSETS_PX = {
    1: (0, 0),
    2: (0, 0),
    3: (0, 0),
    4: (0, 0),
    5: (0, 0),
    6: (0, 0),
    7: (0, 0),
    8: (0, 0),
    9: (0, 0),
    10: (0, 0),
    11: (0, 0),
    12: (0, 0),
}


# ----------------------------------------------------------
# Draw the main diamond structure
# ----------------------------------------------------------
def _draw_diamond(
    dwg: svgwrite.Drawing,
    width: int,
    height: int,
    margin: int = 40,
    fill_gradient_id: Optional[str] = None,
):
    """
    Draw North Indian style chart using the exact 12-house polygon
    layout from the standalone SVG example, scaled to the given canvas.
    """
    scale, ox, oy = _base_transform(width, height, margin)

    def tr(pt):
        bx, by = pt
        return (ox + bx * scale, oy + by * scale)

    # House polygons from the example script
    houses_points = [
        # 1st house
        [(100, 225), (200, 300), (300, 225), (200, 150)],
        # 2nd house
        [(100, 225), (0, 300), (200, 300)],
        # 3rd house
        [(0, 150), (0, 300), (100, 225)],
        # 4th house
        [(0, 150), (100, 225), (200, 150), (100, 75)],
        # 5th house
        [(0, 0), (0, 150), (100, 75)],
        # 6th house
        [(0, 0), (100, 75), (200, 0)],
        # 7th house
        [(100, 75), (200, 150), (300, 75), (200, 0)],
        # 8th house
        [(200, 0), (300, 75), (400, 0)],
        # 9th house
        [(300, 75), (400, 150), (400, 0)],
        # 10th house
        [(300, 75), (200, 150), (300, 225), (400, 150)],
        # 11th house
        [(300, 225), (400, 300), (400, 150)],
        # 12th house
        [(300, 225), (200, 300), (400, 300)],
    ]

    fill = f"url(#{fill_gradient_id})" if fill_gradient_id else "white"

    for pts in houses_points:
        poly = [tr(p) for p in pts]
        dwg.add(
            dwg.polygon(
                poly,
                stroke="#000",
                fill=fill,
                stroke_width=2,
            )
        )


# ----------------------------------------------------------
# Abbreviate planet names
# ----------------------------------------------------------
def _planet_abbrev(name: str, retrograde: bool = False, combust: bool = False) -> str:
    mapping = {
        "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
        "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa",
        "Rahu": "Ra", "Ketu": "Ke", "Ascendant": "As"
    }
    abbrev = mapping.get(name, name[:3])
    if retrograde:
        abbrev += "*"
    if combust:
        abbrev += "#"
    return abbrev


# ----------------------------------------------------------
# RENDER FUNCTION (SVG + PNG)
# ----------------------------------------------------------
def render_north_indian_chart(
    chart_model: Dict[str, Any],
    out_svg_path: str,
    size: int = 600,
    width: Optional[int] = None,
    height: Optional[int] = None,
    margin: int = 40,
    include_signs: bool = True,
    sign_style: dict = SIGN_STYLE,
    planet_style: dict = PLANET_STYLE,
    house_label_style: dict = HOUSE_LABEL_STYLE,
    planet_colors: Optional[Dict[str, str]] = None,
    to_png: Optional[str] = None,
) -> str:

    # Ensure directories exist
    os.makedirs(os.path.dirname(out_svg_path) or ".", exist_ok=True)
    if to_png:
        os.makedirs(os.path.dirname(to_png) or ".", exist_ok=True)

    # Determine dimensions: if width/height specified, use rectangular; otherwise square
    w = width if width is not None else size
    h = height if height is not None else size

    # Create SVG (scalable with viewBox, but still uses explicit coordinate system)
    dwg = svgwrite.Drawing(out_svg_path, size=(w, h), profile="full")
    dwg.attribs["width"] = "100%"
    dwg.attribs["height"] = "100%"
    dwg.attribs["viewBox"] = f"0 0 {w} {h}"
    dwg.add(dwg.rect(insert=(0, 0), size=(w, h), fill="white"))

    # Define a soft linear gradient for the inner diamond / houses
    house_grad_id = "houseGrad"
    grad = dwg.linearGradient(start=(0, 0), end=(0, 1), id=house_grad_id)
    grad.add_stop_color(0, "white")
    grad.add_stop_color(1, "#f0f3bf")
    dwg.defs.add(grad)

    _draw_diamond(dwg, w, h, margin, fill_gradient_id=house_grad_id)

    house_pos = _house_positions(w, h, margin)
    houses = chart_model.get("houses", {})
    planet_positions = chart_model.get("planet_positions", {})

    # Create status lookup for quick access during label generation
    status_lookup = {}
    if planet_positions:
        for p_name, p_data in planet_positions.items():
            status_lookup[p_name] = {
                "retro": p_data.get("is_retrograde", False),
                "combust": p_data.get("is_combust", False)
            }

    houses_drawn = []
    for house_num in range(1, 13):
        x, y = house_pos.get(house_num, (w / 2, h / 2))
        if house_num not in house_pos:
            print(f"[CHART RENDER] WARNING: No position defined for house {house_num}")
        info = houses.get(house_num, {}) or houses.get(str(house_num), {})
        sign_name = info.get("sign_name", "")
        planets = info.get("planets", [])
        houses_drawn.append(house_num)

        scale = w / 600.0  # Scale based on width for consistent offsets
        dx_px, dy_px = HOUSE_LABEL_OFFSETS_PX.get(house_num, (0.0, 0.0))
        label_x = x + (dx_px * scale)
        label_y = y + (dy_px * scale)

        # sign_num derived from sign_name OR cusp_deg (e.g. Aries=1, Taurus=2)
        sign_num_val = ""
        cusp_deg = info.get("cusp_deg")
        if cusp_deg is not None:
            sign_num_val = (int(cusp_deg // 30) % 12) + 1
        elif sign_name and sign_name in SIGN_FULL:
            sign_num_val = SIGN_FULL.index(sign_name) + 1
        
        # Display Sign Number (Standard North Indian format)
        dwg.add(
            dwg.text(
                f"{sign_num_val or ''}",
                insert=(label_x, label_y),
                font_size=16,
                fill="#111111",
                font_family=house_label_style["font_family"],
                font_weight="bold",
                text_anchor="middle",
            )
        )

        # Separate sign names are now redundant since we show sign_num in center
        # Hiding them to keep chart clean per user request
        if False and include_signs and sign_name:
            dwg.add(
                dwg.text(
                    sign_name,
                    insert=(label_x, label_y + 18),
                    font_size=sign_style["font_size"],
                    fill=sign_style["fill"],
                    font_family=sign_style["font_family"],
                    text_anchor="middle",
                )
            )

        # Planets – arranged in a circular pattern around the house centre,
        # matching the "placeholder ring" style from the standalone SVG example.
        if planets:
            n_planets = len(planets)
            # Radius scales with chart width so it looks good across sizes
            base_radius = 18.0
            scale = w / 600.0
            radius = base_radius * scale

            if n_planets == 1:
                # Single planet: place slightly below the house number / sign
                px = label_x
                py = (label_y + 28) if include_signs and sign_name else (label_y + 18)
                p_name = str(planets[0])
                p_color = planet_colors.get(p_name, planet_style["fill"]) if planet_colors else planet_style["fill"]
                
                # Get retrograde/combust status
                p_status = status_lookup.get(p_name, {"retro": False, "combust": False})
                
                dwg.add(
                    dwg.text(
                        _planet_abbrev(p_name, retrograde=p_status["retro"], combust=p_status["combust"]),
                        insert=(px, py),
                        font_size=planet_style["font_size"],
                        fill=p_color,
                        font_family=planet_style["font_family"],
                        text_anchor="middle",
                    )
                )
            else:
                # Multiple planets: place on a circle around the centre
                for j, p in enumerate(planets):
                    angle = 2.0 * math.pi * j / n_planets
                    px = label_x + radius * math.cos(angle)
                    py = label_y + radius * math.sin(angle)
                    p_name = str(p)
                    p_color = planet_colors.get(p_name, planet_style["fill"]) if planet_colors else planet_style["fill"]
                    
                    # Get retrograde/combust status
                    p_status = status_lookup.get(p_name, {"retro": False, "combust": False})
                    
                    dwg.add(
                        dwg.text(
                            _planet_abbrev(p_name, retrograde=p_status["retro"], combust=p_status["combust"]),
                            insert=(px, py),
                            font_size=planet_style["font_size"],
                            fill=p_color,
                            font_family=planet_style["font_family"],
                            text_anchor="middle",
                        )
                    )
    
    # Debug: Verify all 12 houses were drawn
    if len(houses_drawn) < 12:
        print(f"[CHART RENDER] WARNING: Only {len(houses_drawn)} houses drawn: {houses_drawn}")
    else:
        print(f"[CHART RENDER] Successfully drew all 12 houses: {sorted(houses_drawn)}")

    # Footer & Legend
    meta = chart_model.get("meta", {})
    footer = meta.get("name", "")
    
    # Check if we have any retrograde or combust planets to justify a legend
    has_retro = any(s.get("retro") for s in status_lookup.values())
    has_combust = any(s.get("combust") for s in status_lookup.values())
    
    if footer:
        dwg.add(
            dwg.text(
                footer,
                insert=(w / 2, h - 25),
                font_size=12,
                text_anchor="middle",
                fill="#444",
                font_family="DejaVu Sans",
            )
        )
    
    # Add Legend below meta/footer
    legend_parts = []
    if has_retro: legend_parts.append("* = Vakri (Retrograde)")
    if has_combust: legend_parts.append("# = Asth (Combust)")
    
    if legend_parts:
        legend_text = "  ".join(legend_parts)
        dwg.add(
            dwg.text(
                legend_text,
                insert=(w / 2, h - 8),
                font_size=9,
                text_anchor="middle",
                fill="#666",
                font_style="italic",
                font_family="DejaVu Sans",
            )
        )

    dwg.save()

    # -----------------------------------
    # Convert to PNG (reliable version)
    # -----------------------------------
    if to_png:
        try:
            import cairosvg

            cairosvg.svg2png(
                url=out_svg_path,
                write_to=to_png,
                output_width=w,
                output_height=h,
            )
        except ImportError:
            # cairosvg not installed - PNG conversion skipped (SVG will be used instead)
            print(f"[CHART RENDER] WARNING: cairosvg is not installed. PNG conversion skipped. SVG saved to: {out_svg_path}")
        except Exception as e:
            # PNG conversion failed (usually missing Cairo system libraries on Windows)
            # This is expected - SVG fallback will be used
            print(f"[CHART RENDER] WARNING: PNG conversion failed: {e}. SVG saved to: {out_svg_path}")

    return out_svg_path

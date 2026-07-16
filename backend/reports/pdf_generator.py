"""
reports/pdf_generator.py

Patched PDF generator for Vedic astrology reports.
- Robust chart imports for your project layout (uses build_rashi_chart).
- Debug logging for every chart rendering step.
- Auto-create reports/images folder.
- Enrich chart models with sign names (handles int & str keys).
- Embeds charts (D1, D9) when available and logs missing pieces.
- Preserves themes, bilingual headings, watermark, TOC, and page numbers.
"""

from __future__ import annotations
import os
import traceback
from typing import Any, Dict, List, Optional, Callable

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm, inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
    Flowable,
    Image,
    PageBreak,
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPDF

from reports.report_data import assemble_report_data
from core.utils import get_sign_name
from core.knowledge.planet_house_text import (
    planet_interpretation, planet_rich_interpretation,
    get_varga_context, get_sav_interpretation, get_varga_sign_intro
)
from core.rishi.rishi_core import run_rishi_core
from core.rishi.neural_mode import run_rishi_neural_mode
from core.cosmic.trainer import run_cosmic_trainer
from core.cosmic.feedback_loop import learn_from_report
from core.karma.simulator import run_karma_simulation
from core.destiny.destiny_engine import run_destiny_engine
from core.life_events.life_event_engine import detect_life_events
from core.transits.transit_engine import detect_transit_events
from core.destiny.destiny_timeline_engine import build_destiny_timeline
from core.destiny.destiny_graph_visualizer import DestinyGraphFlowable
from core.destiny.cosmic_life_map_visualizer import CosmicLifeMapFlowable

# Ensure images folder always exists
os.makedirs("reports/images", exist_ok=True)

# ------------------------
# Branding & Defaults (from user)
# ------------------------
BRAND_NAME = "AstroConsut"
BRAND_URL = "www.astroconsult.com"
BRAND_LOGO = "data/branding/omlogo.jpg"  # e.g. "data/branding/logo.png" - optional
WATERMARK_IMAGE: Optional[str] = None  # e.g. "data/branding/watermark.png" - optional
WATERMARK_TEXT = BRAND_NAME

# Optional large cover image shown on the first page (e.g. sage + chart artwork)
# Place your image at this path to enable it.
COVER_IMAGE: Optional[str] = None


def _add_destiny_timeline(story, report_data):
    """Helper to add the Destiny Timeline SVG to the PDF story."""
    svg_path = report_data.get("destiny_svg")
    if not svg_path or not os.path.exists(svg_path):
        return

    try:
        drawing = svg2rlg(svg_path)
        # Scaled drawing if needed, but svg2rlg usually handles size from SVG
        story.append(drawing)
    except Exception as e:
        print(f"Error adding destiny timeline SVG: {e}")


def _add_life_map_page(story, report_data, styles):
    """Helper to add the Cosmic Life Wheel SVG to the PDF story."""
    svg_path = report_data.get("life_map_svg")
    if not svg_path or not os.path.exists(svg_path):
        return

    story.append(PageBreak())
    story.append(Paragraph("Cosmic Life Map", styles["Section"]))

    try:
        drawing = svg2rlg(svg_path)
        if drawing:
            # Scale to page width
            drawing.width = 500
            drawing.height = 500
            story.append(drawing)
    except Exception as e:
        print(f"Error adding cosmic life wheel SVG: {e}")


def _add_destiny_matrix_page(story, report_data, styles):
    """Helper to add the Destiny Matrix SVG to the PDF story."""
    svg_path = report_data.get("destiny_matrix_svg")
    if not svg_path or not os.path.exists(svg_path):
        return

    story.append(PageBreak())
    story.append(Paragraph("Destiny Matrix Visualizer", styles["Section"]))

    try:
        drawing = svg2rlg(svg_path)
        if drawing:
            # Scale to fit page width (A4 width ~595pt, margins ~36pt total -> ~550pt safe)
            # Matrix renderer uses width=700
            scale = 500 / drawing.width
            drawing.scale(scale, scale)
            drawing.width = drawing.width * scale
            drawing.height = drawing.height * scale
            story.append(drawing)
    except Exception as e:
        print(f"Error adding Destiny Matrix SVG: {e}")

# ------------------------
# Theme palettes
# ------------------------
THEMES = {
    "light": {
        "background": colors.white,
        "text": colors.black,
        "header": colors.HexColor("#1a237e"),
        "accent": colors.HexColor("#3949ab"),
        "watermark": colors.lightgrey,
        "table_header": colors.HexColor("#eeeeee"),
    },
    "dark": {
        "background": colors.HexColor("#121212"),
        "text": colors.white,
        "header": colors.HexColor("#bb86fc"),
        "accent": colors.HexColor("#03dac5"),
        "watermark": colors.HexColor("#333333"),
        "table_header": colors.HexColor("#1e1e1e"),
    },
    "gold": {
        "background": colors.white,
        "text": colors.HexColor("#334155"), 
        "header": colors.HexColor("#4f46e5"), 
        "accent": colors.HexColor("#6366f1"), 
        "watermark": colors.HexColor("#f8fafc"), 
        "table_header": colors.HexColor("#f1f5f9"), 
    },
}

# ------------------------
# PDF defaults from user input
# ------------------------
DEFAULT_THEME = "gold"
ENCRYPTION_ENABLED = False
DEFAULT_USER_PASSWORD = None
DEFAULT_OWNER_PASSWORD = None
BILINGUAL = False  # English only — set to True to enable bilingual (English + Hindi) headings
DEFAULT_REPORT_STYLE = "premium"  # minimal | premium

# ------------------------
# Optional chart/renderers detection (defensive, robust for option B)
# ------------------------
_HAS_CHARTS = False
_chart_import_errors: List[str] = []

# Define symbols to avoid NameError/UnboundLocalError with type hints
build_rasi_chart: Optional[Callable] = None
build_navamsa_chart: Optional[Callable] = None
build_d10_chart: Optional[Callable] = None
compute_ashtakavarga_classical: Optional[Callable] = None
render_north_indian_chart: Optional[Callable] = None
render_divisional_chart: Optional[Callable] = None
render_ashtakavarga_wheel: Optional[Callable] = None

try:
    # per user's choice B: expect charts/rashi_chart.py -> build_rashi_chart()
    try:
        from charts.rashi_chart import build_rashi_chart
        build_rasi_chart = build_rashi_chart
        print("[CHART IMPORT] Using charts/rashi_chart.build_rashi_chart()")
    except Exception:
        # fallback to rashi_chart if present
        try:
            from charts.rashi_chart import build_rashi_chart as build_fallback
            build_rasi_chart = build_fallback
            print("[CHART IMPORT] Using charts/rashi_chart.build_rashi_chart() fallback")
        except Exception:
            print("[CHART IMPORT] Rasi chart builder not found")

    # Navamsa (d9)
    try:
        from charts.divisional.d9 import build_navamsa_chart
        build_navamsa_chart = build_navamsa_chart
        print("[CHART IMPORT] Using charts.divisional.d9.build_navamsa_chart()")
    except Exception:
        # try alternate name (navamsa)
        try:
            from charts.divisional.d9 import build_navamsa_chart as build_fallback
            build_navamsa_chart = build_fallback
            print("[CHART IMPORT] Using charts.divisional.d9.build_navamsa_chart() fallback")
        except Exception:
            print("[CHART IMPORT] Navamsa builder not found (optional)")

    # d10 optional
    try:
        from charts.divisional.d10 import build_d10_chart
        build_d10_chart = build_d10_chart
        print("[CHART IMPORT] D10 builder found")
    except Exception as e:
        print(f"[CHART IMPORT] D10 builder not found (optional)")

    # ashtakavarga compute
    try:
        from charts.ashtakavarga.classical import compute_ashtakavarga_classical
        compute_ashtakavarga_classical = compute_ashtakavarga_classical
        print("[CHART IMPORT] Ashtakavarga classical found")
    except Exception:
        print("[CHART IMPORT] Ashtakavarga classical NOT found (optional)")

    # renderers (svg->png)
    try:
        from charts.renderers.north_indian_rasi_renderer import render_north_indian_chart
        from charts.renderers.north_indian_divisional_renderer import render_divisional_chart
        from charts.renderers.ashtakavarga_wheel_renderer import render_ashtakavarga_wheel
        _HAS_CHARTS = True
        print("[CHART IMPORT] Renderers found")
    except Exception as e:
        print(f"[CHART IMPORT] Renderers NOT found: {e}")

except Exception as e:
    _HAS_CHARTS = False
    _chart_import_errors.append(str(e))
    print("[CHART IMPORT ERROR]", e)


# ------------------------
# Fonts
# ------------------------
BASE_FONT = "Helvetica"
BOLD_FONT = "Helvetica-Bold"
HINDI_FONT = "Helvetica" 

# Register Unicode fonts for Devanagari (Hindi) support using absolute paths
_FILE_DIR = os.path.dirname(os.path.abspath(__file__))
# If running as module from root, __file__ may be reports/pdf_generator.py
# If reports/fonts exists relative to root, path should be d:/vedic-astrology-app/reports/fonts
# But better to check relative to this file's dir. 
_FONT_PATH_PRIMARY = os.path.join(_FILE_DIR, "fonts", "NotoSansDevanagari-Regular.ttf")
# Secondary fallbacks if the above doesn't exist
_FONT_PATH_ROOT = os.path.join(os.path.dirname(_FILE_DIR), "NotoSansDevanagari-Regular.ttf")
_FONT_PATH_SECONDARY = os.path.join(os.path.dirname(_FILE_DIR), "reports", "fonts", "NotoSansDevanagari-Regular.ttf")
_FONT_PATH_FALLBACK = os.path.join(os.getcwd(), "reports", "fonts", "NotoSansDevanagari-Regular.ttf")

try:
    font_loaded = False
    for fpath in [_FONT_PATH_PRIMARY, _FONT_PATH_ROOT, _FONT_PATH_SECONDARY, _FONT_PATH_FALLBACK]:
        if os.path.exists(fpath):
            pdfmetrics.registerFont(TTFont("NotoSansDev", fpath))
            HINDI_FONT = "NotoSansDev"
            print(f"[FONT LOAD] Registered font from: {fpath}")
            font_loaded = True
            break
    if not font_loaded:
        print("[FONT ERROR] Could not find NotoSansDevanagari font in any of the search paths.")
        HINDI_FONT = BASE_FONT
except Exception as e:
    print(f"[FONT ERROR] Failed to register Devanagari fonts: {e}")
    HINDI_FONT = BASE_FONT

# Set global base font to NotoSansDev ONLY IF Hindi/Bilingual is requested elsewhere, 
# but for now we register fonts if they exist. 
# Inside render_detailed_pdf, we will dynamically set the font for the report.
if HINDI_FONT != BASE_FONT:
    # We still keep NotoSansDev as a registered font 'HINDI_FONT' 
    # but don't force it as the only BASE_FONT yet.
    pass


# ------------------------
# Styles
# ------------------------
styles = getSampleStyleSheet()

# Update standard styles to use our base font (which supports Hindi)
for style_name in styles.byName:
    styles[style_name].fontName = BASE_FONT

styles.add(ParagraphStyle(
    name="Section", 
    parent=styles["Heading1"],
    fontName=BASE_FONT, 
    fontSize=18, 
    leading=22, 
    spaceAfter=12,
    textColor=colors.HexColor("#1a237e"), # Deep blue for professional look
    borderPadding=5,
    alignment=1 # Center alignment for sections
))

styles.add(ParagraphStyle(
    name="SubSection", 
    parent=styles["Heading2"],
    fontName=BASE_FONT, 
    fontSize=14, 
    leading=18, 
    spaceBefore=10,
    spaceAfter=6,
    textColor=colors.HexColor("#0d47a1")
))

styles["BodyText"].fontName = BASE_FONT
styles["BodyText"].fontSize = 11
styles["BodyText"].leading = 14
styles["BodyText"].alignment = 4 # Justified for professional feel
styles["Normal"].fontName = BASE_FONT

# Update fonts as requested
if "Body" not in styles:
    styles.add(ParagraphStyle(name="Body", parent=styles["BodyText"]))

styles["Body"].fontName = BASE_FONT
styles["Section"].fontName = BOLD_FONT
if "Title" in styles:
    styles["Title"].fontName = BOLD_FONT

# Hindi and Bilingual styles removed as English-only is the default.

# Bilingual style removed

# ------------------------
# Table helpers
# ------------------------
def _key_value_table(pairs: List[List[str]], col_widths=None, theme_palette=None) -> Table:
    if theme_palette is None:
        header_color = colors.whitesmoke
        text_color = colors.black
    else:
        header_color = theme_palette["table_header"]
        text_color = theme_palette["text"]

    data = [[Paragraph(f"<b>{label}</b>", styles["BodyText"]), Paragraph(value, styles["BodyText"])] for label, value in pairs]
    tbl = Table(data, colWidths=col_widths or [120, 300])
    tbl.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), header_color),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f7f7f7")]),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                  ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                  ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TEXTCOLOR", (0, 0), (-1, -1), text_color),
            ]
        )
    )
    return tbl


def _list_table(items: List[Dict[str, str]], theme_palette=None) -> Table:
    if theme_palette is None:
        header_color = colors.lightgrey
        text_color = colors.black
    else:
        header_color = theme_palette["table_header"]
        text_color = theme_palette["text"]

    data = [["Attribute", "Value"]] + [[item["label"], item["value"]] for item in items]
    tbl = Table(data, colWidths=[150, 270])
    tbl.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), header_color),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                  ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                  ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                ("TEXTCOLOR", (0, 0), (-1, -1), text_color),
            ]
        )
    )
    return tbl


def _planet_table(entries: List[Dict[str, Any]], theme_palette=None) -> Table:
    if theme_palette is None:
        header_color = colors.HexColor("#efefef")
        text_color = colors.black
    else:
        header_color = theme_palette["table_header"]
        text_color = theme_palette["text"]

    data = [["Planet", "R", "Sign", "Sign Lord", "Degree", "Nakshatra", "House"]]
    for row in entries:
        data.append(
            [
                row.get("planet", ""),
                "R" if row.get("retrograde") else "",
                row.get("sign", ""),
                row.get("sign_lord", ""),
                f"{row.get('degree', 0.0):.2f}",
                f"{row.get('nakshatra','')} ({row.get('nakshatra_lord','')})",
                str(row.get("house", "")) or "-",
            ]
        )
    tbl = Table(
        data,
        repeatRows=1,
        colWidths=[70, 20, 80, 70, 60, 120, 40],
        style=TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), header_color),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                  ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                  ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                ("TEXTCOLOR", (0, 0), (-1, -1), text_color),
            ]
        ),
    )
    return tbl


def _dosha_table(dosha: Dict[str, Any], theme_palette=None) -> Table:
    if theme_palette is None:
        header_color = colors.lightgrey
        text_color = colors.black
    else:
        header_color = theme_palette["table_header"]
        text_color = theme_palette["text"]

    rows = [["Dosha", "Status", "Summary"]]
    for key, value in dosha.items():
        rows.append(
            [
                key.replace("_", " ").title(),
                "Present" if value.get("present") else "Not Present",
                value.get("summary", ""),
            ]
        )
    tbl = Table(rows, repeatRows=1, colWidths=[120, 80, 220])
    tbl.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), header_color),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                  ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                  ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                ("TEXTCOLOR", (0, 0), (-1, -1), text_color),
            ]
        )
    )
    return tbl


# ------------------------
# House positions for Lagna flowable (North Indian style)
# Positions are normalized (0-1) relative to chart size
# Layout: 1st at top-center, numbering counter-clockwise
# ------------------------
HOUSE_POSITIONS = {
    # Normalised coordinates (0–1) matching hand-drawn reference image layout
    # 1  = top centre triangle - centered
    1: (0.50, 0.256),
    # 2  = upper‑left triangle - positioned towards upper-left corner
    2: (0.189, 0.194),
    # 3  = central upper‑left quadrilateral - centered
    3: (0.211, 0.289),
    # 4  = left‑centre triangle - positioned towards left edge
    4: (0.061, 0.50),
    # 5  = bottom‑left triangle - positioned towards bottom-left corner
    5: (0.189, 0.806),
    # 6  = central bottom‑left quadrilateral - centered
    6: (0.211, 0.711),
    # 7  = bottom centre triangle - centered
    7: (0.50, 0.744),
    # 8  = bottom‑right triangle - positioned towards bottom-right corner
    8: (0.811, 0.806),
    # 9  = central bottom‑right quadrilateral - centered
    9: (0.789, 0.711),
    # 10 = right‑centre triangle - positioned towards right edge
    10: (0.939, 0.50),
    # 11 = upper‑right triangle - positioned towards upper-right corner
    11: (0.811, 0.194),
    # 12 = central upper‑right quadrilateral - centered
    12: (0.789, 0.289),
}

HOUSE_LABEL_OFFSETS_PX = {
    # Fine-tuning offsets matching hand-drawn reference image (for size=900, auto-scaled by code)
    # Note: Y offsets are negated because PDF Y-axis is flipped (0 at bottom)
    # House 2: upper-left triangle - positioned towards corner (minimal offset)
    2: (-10, 10),  # left, down visually = up in flipped coords
    # House 3: central upper-left quadrilateral - centered
    3: (-10, 5),  # left, down visually
    # House 4: left-center triangle - positioned towards edge (minimal offset)
    4: (-15, 0),  # left, centered vertically
    # House 5: bottom-left triangle - positioned towards corner (minimal offset)
    5: (-10, -10),  # left, up visually
    # House 6: central bottom-left quadrilateral - centered
    6: (-10, -5),  # left, up visually
    # House 8: bottom-right triangle - positioned towards corner (minimal offset)
    8: (10, -10),  # right, up visually
    # House 9: central bottom-right quadrilateral - centered
    9: (10, -5),  # right, up visually
    # House 10: right-center triangle - positioned towards edge (minimal offset)
    10: (15, 0),  # right, centered vertically
    # House 11: upper-right triangle - positioned towards corner (minimal offset)
    11: (10, 10),  # right, down visually = up in flipped coords
    # House 12: central upper-right quadrilateral - centered
    12: (10, -5),  # right, down visually
}

class LagnaChartFlowable(Flowable):
    def __init__(self, houses: Dict[str, Dict[str, Any]], width: float = 600, height: float = 400, is_english_only: bool = False):
        super().__init__()
        self.houses = houses
        self.width = width
        self.height = height
        self.is_english_only = is_english_only

    def draw(self):
        c = self.canv
        w = self.width
        h = self.height
        cx = w / 2
        cy = h / 2
        margin = min(w, h) * 0.1  # 10% margin based on smaller dimension

        # Outer rectangle (thicker black border)
        c.setStrokeColor(colors.black)
        c.setLineWidth(2)
        c.rect(margin, margin, w - 2*margin, h - 2*margin)
        
        # Inner diamond (connecting midpoints of outer square)
        top = margin
        bottom = h - margin
        left = margin
        right = w - margin
        diamond_points = [(cx, top), (right, cy), (cx, bottom), (left, cy)]
        path = c.beginPath()
        path.moveTo(diamond_points[0][0], diamond_points[0][1])
        # Use simple iteration to avoid slicing type errors in some Pyright versions
        for idx in range(1, len(diamond_points)):
            pt = diamond_points[idx]
            path.lineTo(pt[0], pt[1])
        path.close()
        c.setLineWidth(2)
        c.drawPath(path)

        # Internal lines connecting outer square to inner diamond
        c.setStrokeColor(colors.HexColor("#2c2c2c"))
        c.setLineWidth(2)
        # Vertical and horizontal center lines
        c.line(cx, top, cx, bottom)
        c.line(left, cy, right, cy)
        # Diagonal lines from corners to opposite diamond corners
        c.line(left, cy, cx, top)      # Left to top
        c.line(cx, top, right, cy)     # Top to right
        c.line(right, cy, cx, bottom)  # Right to bottom
        c.line(cx, bottom, left, cy)   # Bottom to left
        # Large "X" connecting the outer corners for clearer house boundaries
        c.line(left, top, right, bottom)
        c.line(right, top, left, bottom)

        # Planet abbreviations mapping
        if self.is_english_only:
            planet_abbrev = {
                "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
                "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa",
                "Rahu": "Ra", "Ketu": "Ke", "Ascendant": "As"
            }
        else:
            planet_abbrev = {
                "Sun": "सू.", "Moon": "चं.", "Mars": "मा.", "Mercury": "बु.",
                "Jupiter": "गु.", "Venus": "शु.", "Saturn": "श.",
                "Rahu": "रा.", "Ketu": "के.", "Ascendant": "ल."
            }

        # Draw house numbers, signs, and planets for ALL 12 houses
        houses_drawn = []
        for house_num in range(1, 13):
            pos = HOUSE_POSITIONS.get(house_num)
            if not pos:
                print(f"[LAGNA CHART] WARNING: No position defined for house {house_num}")
                continue
            
            # Access house from mapping safely
            house = self.houses.get(str(house_num)) or {}
            sign_name = house.get("sign_name", "")
            cusp_deg = house.get("cusp_deg")
            planets = house.get("planets", [])
            
            # Determine sign number (Aries=1, Taurus=2, etc.)
            sign_num_val = ""
            if cusp_deg is not None:
                sign_num_val = (int(cusp_deg // 30) % 12) + 1
            elif sign_name:
                # Basic fallback if cusp_deg is missing
                from core.utils import ZODIAC_SIGNS
                try:
                    sign_num_val = ZODIAC_SIGNS.index(sign_name) + 1
                except: pass

            x = pos[0] * w
            y = h - (pos[1] * h)  # Flip Y coordinate
            houses_drawn.append(house_num)
            
            scale = w / 900.0
            dx_px, dy_px = HOUSE_LABEL_OFFSETS_PX.get(house_num, (0.0, 0.0))
            label_x = x + (dx_px * scale)
            label_y = y + (dy_px * scale)
 
            # Sign number (Standard North Indian chart shows sign index in center)
            c.setFont(BOLD_FONT, 12)
            c.setFillColor(colors.black)
            c.drawCentredString(label_x, label_y - 2, str(sign_num_val or ""))
            
            # Sign names have been disabled in PDF reports per user request

            # Planets (below sign) - stacked vertically
            if planets:
                planet_y = label_y + 12
                for i, planet in enumerate(planets[:4]):  # Max 4 planets
                    # Get abbreviation from mapping, or fall back to first 2 characters
                    raw_p = str(planet)
                    if not raw_p:
                        abbrev = "--"
                    else:
                        abbrev = planet_abbrev.get(raw_p) or raw_p[0:2]
                    
                    # Use appropriate font for abbreviations
                    curr_font = BASE_FONT if self.is_english_only else HINDI_FONT
                    c.setFont(curr_font, 9)
                    c.setFillColor(colors.darkblue)
                    c.drawCentredString(label_x, planet_y + (i * 12), abbrev)
        
        # Debug: Verify all 12 houses were drawn
        if len(houses_drawn) < 12:
            print(f"[LAGNA CHART] WARNING: Only {len(houses_drawn)} houses drawn: {houses_drawn}")
        else:
            print(f"[LAGNA CHART] Successfully drew all 12 houses: {sorted(houses_drawn)}")


# ------------------------
# Language-aware text helpers
# ------------------------
def _get_text(english: str, hindi: str, is_bilingual: bool = False, is_hindi_only: bool = False, is_english_only: bool = False) -> str:
    """Get text based on language mode."""
    if is_hindi_only:
        return hindi or english
    if is_bilingual:
        if hindi and (hindi != english):
            return f"{english} / {hindi}"
        return english
    # Default is English
    return english


# ------------------------
# Small helpers
# ------------------------
def _predictions_block(predictions: Dict[str, Dict[str, str]], is_bilingual: bool = False, is_english_only: bool = False) -> List[Any]:
    blocks: List[Any] = []
    
    def _filter_text(t):
        if is_english_only and " / " in t:
            return t.split(" / ")[0].strip()
        return t

    for info in predictions.values():
        title = _filter_text(info.get("title", ""))
        text = _filter_text(info.get("text", ""))
        # simple bilingual headings: English + Hindi (Hindi text must be provided by assembler)
        blocks.append(Paragraph(title, styles["SubSection"]))
        blocks.append(Paragraph(text, styles["BodyText"]))
        blocks.append(Spacer(1, 4))
    return blocks


# ------------------------
# Page decoration: watermark, footer, page number
# ------------------------
def _draw_watermark(canvas_obj, doc, theme_palette):
    canvas_obj.saveState()
    # optional watermark image
    try:
        if WATERMARK_IMAGE is not None and os.path.exists(WATERMARK_IMAGE):
            img = ImageReader(WATERMARK_IMAGE)
            iw, ih = img.getSize()
            scale = 0.35
            canvas_obj.drawImage(
                img,
                0.5 * doc.pagesize[0] - (iw * scale) / 2,
                0.5 * doc.pagesize[1] - (ih * scale) / 2,
                width=iw * scale,
                height=ih * scale,
                mask="auto",
                preserveAspectRatio=True,
                anchor="c",
            )
    except Exception:
        pass

    # diagonal watermark text
    canvas_obj.setFont(BASE_FONT, 40)
    canvas_obj.setFillColor(theme_palette.get("watermark", colors.lightgrey))
    canvas_obj.saveState()
    canvas_obj.translate(doc.pagesize[0] / 2, doc.pagesize[1] / 2)
    canvas_obj.rotate(45)
    canvas_obj.drawCentredString(0, 0, WATERMARK_TEXT)
    canvas_obj.restoreState()
    canvas_obj.restoreState()


def _draw_footer(canvas_obj, doc, theme_palette):
    import random
    canvas_obj.saveState()
    canvas_obj.setStrokeColor(theme_palette.get("primary", colors.HexColor("#1a237e")))
    canvas_obj.setLineWidth(0.5)
    canvas_obj.line(18 * mm, 18 * mm, doc.pagesize[0] - 18 * mm, 18 * mm)
    
    quotes = [
        '"The Lagna is not just a rising sign. It is your arrival, your Introduction, the lens through which God sees Himself in you. The Point of Lagna is the exact moment your soul steps into karma bhoomi, claiming a body, a breath and a destiny."',
        '"Astrology is a science of time. Every moment has a meaning, a message, and a manifestation." — Dr. B.V. Raman',
        '"The Navagrahas do not merely orbit the Sun; they orbit the soul, keeping a meticulous record of our karmic debts and cosmic credits."',
        '"Your Kundli is the blueprint of your soul\'s journey; it does not bind you, it simply maps the terrain of your karma."',
        '"The Moon reflects our mind, the Sun our soul. Together they weave the tapestry of human existence in the cosmic play of time."'
    ]
    quote = random.choice(quotes)
    
    canvas_obj.setFont(BASE_FONT, 7.5)
    canvas_obj.setFillColor(colors.HexColor("#6b7280"))
    canvas_obj.drawCentredString(doc.pagesize[0] / 2, 21 * mm, quote)
    
    canvas_obj.setFont(BASE_FONT, 8)
    canvas_obj.setFillColor(colors.grey)
    footer_text = f"CONFIDENTIAL | {BRAND_NAME} — {BRAND_URL}"
    canvas_obj.drawString(18 * mm, 12 * mm, footer_text)
    canvas_obj.restoreState()


def _add_page_number(canvas_obj, doc):
    page_num = canvas_obj.getPageNumber()
    canvas_obj.setFont(BASE_FONT, 9)
    canvas_obj.setFillColor(colors.grey)
    canvas_obj.drawRightString((doc.pagesize[0] - 18 * mm), 12 * mm, f"Page {page_num}")


def _draw_header(canvas_obj, doc, theme_palette):
    canvas_obj.saveState()
    canvas_obj.setStrokeColor(theme_palette.get("primary", colors.HexColor("#1a237e")))
    canvas_obj.setLineWidth(0.5)
    canvas_obj.line(18 * mm, doc.pagesize[1] - 18 * mm, doc.pagesize[0] - 18 * mm, doc.pagesize[1] - 18 * mm)
    
    canvas_obj.setFont(BASE_FONT, 8)
    canvas_obj.setFillColor(colors.grey)
    canvas_obj.drawString(18 * mm, doc.pagesize[1] - 15 * mm, "Vedic Astrology Analysis Report")
    canvas_obj.drawRightString(doc.pagesize[0] - 18 * mm, doc.pagesize[1] - 15 * mm, "Generated based on Classical Sutras")
    canvas_obj.restoreState()

def _decorate_page(canvas_obj, doc, theme_palette):
    # Optionally fill background for dark theme
    if theme_palette.get("background") != colors.white:
        canvas_obj.setFillColor(theme_palette["background"])
        canvas_obj.rect(0, 0, doc.pagesize[0], doc.pagesize[1], fill=1, stroke=0)
    
    _draw_header(canvas_obj, doc, theme_palette)
    _draw_watermark(canvas_obj, doc, theme_palette)
    _add_page_number(canvas_obj, doc)
    _draw_footer(canvas_obj, doc, theme_palette)


# ------------------------
# Table of Contents helper
# ------------------------
def _table_of_contents():
    toc = TableOfContents()
    toc.levelStyles = [
        ParagraphStyle(
            fontName=BASE_FONT,
            name="TOCHeading1",
            fontSize=12,
            leftIndent=20,
            firstLineIndent=-20,
        ),
        ParagraphStyle(
            fontName=BASE_FONT,
            name="TOCHeading2",
            fontSize=10,
            leftIndent=40,
            firstLineIndent=-20,
        ),
    ]
    return toc


# ------------------------
# Chart rendering helper (defensive)
# ------------------------
def _safe_makedirs(path: str) -> None:
    try:
        os.makedirs(path, exist_ok=True)
    except Exception:
        pass


def _enrich_chart_with_sign_names(chart: Dict[str, Any]) -> Dict[str, Any]:
    """
    Enrich a chart's houses with sign_name derived from cusp_deg.
    This works when house keys are ints or strings.
    """

    houses = chart.get("houses", {})
    for house_num in range(1, 13):
        # accept either int or string keys
        hinfo = houses.get(house_num) or houses.get(str(house_num))
        if not hinfo:
            # Create empty house entry if missing
            if house_num not in houses:
                houses[house_num] = {}
            hinfo = houses[house_num]
        
        # Ensure sign_name is present
        if "sign_name" not in hinfo or not hinfo.get("sign_name"):
            if "cusp_deg" in hinfo:
                cusp_deg = hinfo.get("cusp_deg")
                if cusp_deg is not None:
                    try:
                        hinfo["sign_name"] = get_sign_name(float(cusp_deg))
                    except Exception:
                        hinfo["sign_name"] = ""
                else:
                    hinfo["sign_name"] = ""
            else:
                hinfo["sign_name"] = ""
        
        # Ensure planets list exists
        if "planets" not in hinfo:
            hinfo["planets"] = []
        elif not isinstance(hinfo["planets"], list):
            hinfo["planets"] = []
    
    return chart


def _render_charts_from_report_data(report_data: Dict[str, Any], out_dir: str = "reports/images") -> Dict[str, str]:
    chart_images: Dict[str, str] = {}
    _safe_makedirs(out_dir)

    d1 = report_data.get("chart")
    jd_ut = report_data.get("jd_ut") or report_data.get("basic_details", {}).get("jd_ut")
    lat = report_data.get("basic_details", {}).get("lat")
    lon = report_data.get("basic_details", {}).get("lon")

    print("[CHART RENDER] _HAS_CHARTS =", _HAS_CHARTS)

    # Calculate planet colors mapped by effect
    planet_colors_hex = {}
    planets_strength = report_data.get("strength", {}).get("planets", {})
    for p, pd in planets_strength.items():
        dig = pd.get("dignity", "Neutral")
        if dig in ["Exalted", "Moolatrikona", "Own Sign"]:
            planet_colors_hex[p] = "#008000" # Positive -> Green
        elif dig in ["Debilitated"]:
            planet_colors_hex[p] = "#ff0000" # Negative -> Red
        else:
            planet_colors_hex[p] = "#0000ff" # Neutral -> Blue

    # Try to build D1 if missing
    if not d1 and _HAS_CHARTS and build_rasi_chart is not None and jd_ut and lat is not None and lon is not None:
        try:
            d1 = build_rasi_chart(jd_ut, lat, lon, house_system="W", style="north")
            report_data["chart"] = d1
            print("[CHART RENDER] Built D1 chart model")
        except Exception as e:
            print("[CHART RENDER] Failed to build D1 chart model:", e)
            d1 = None

    # Render D1
    if _HAS_CHARTS and d1:
        try:
            d1 = _enrich_chart_with_sign_names(d1)
            
            # Add meta field for renderer footer
            if "meta" not in d1:
                name = report_data.get("basic_details", {}).get("name", "")
                birth_datetime = report_data.get("basic_details", {}).get("birth_datetime", "")
                birth_place = report_data.get("basic_details", {}).get("birth_place", "")
                d1["meta"] = {
                    "name": f"{name} — {birth_datetime} {birth_place}".strip()
                }
            
            # Debug: Print chart structure
            print("[CHART RENDER] D1 chart structure:")
            print(f"  - Has houses: {'houses' in d1}")
            if "houses" in d1:
                houses = d1["houses"]
                print(f"  - Houses count: {len(houses)}")
                for h in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]:
                    hinfo = houses.get(h) or houses.get(str(h), {})
                    sign_name = hinfo.get("sign_name", "")
                    planets = hinfo.get("planets", [])
                    print(f"  - House {h}: sign_name='{sign_name}', planets={planets}")
            print(f"  - Has meta: {'meta' in d1}")
            if "meta" in d1:
                print(f"  - Meta name: {d1['meta'].get('name', '')}")
            
            rasi_svg = os.path.join(out_dir, "rasi_chart.svg")
            rasi_png = os.path.join(out_dir, "rasi_chart.png")
            print("[CHART RENDER] Rendering D1 ->", rasi_svg, "PNG->", rasi_png)
            # Explicitly ensure include_signs=True and render with full data
            if render_north_indian_chart is not None:
                render_north_indian_chart(
                    d1,
                    rasi_svg,
                    size=600,
                    width=800,
                    height=533,
                    include_signs=False,  # Disable sign names to declutter
                    planet_colors=planet_colors_hex,
                    to_png=rasi_png
                )
            print("[CHART RENDER] SVG exists?", os.path.exists(rasi_svg), "PNG exists?", os.path.exists(rasi_png))
            
            # Verify SVG contains sign names and planets
            if os.path.exists(rasi_svg):
                try:
                    with open(rasi_svg, 'r', encoding='utf-8') as f:
                        svg_content = f.read()
                        has_signs = any(sign in svg_content for sign in ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"])
                        has_planets = any(abbrev in svg_content for abbrev in ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa", "Ra", "Ke"])
                        print(f"[CHART RENDER] SVG verification: has_signs={has_signs}, has_planets={has_planets}")
                        if not has_signs:
                            print("[CHART RENDER] WARNING: SVG does not contain sign names!")
                        if not has_planets:
                            print("[CHART RENDER] WARNING: SVG does not contain planet abbreviations!")
                except Exception as e:
                    print(f"[CHART RENDER] Failed to verify SVG content: {e}")
            # Validate PNG file before adding - must be valid image
            if os.path.exists(rasi_png) and os.path.getsize(rasi_png) > 100:  # At least 100 bytes
                try:
                    from PIL import Image as PILImage
                    # Fully load and verify the image
                    img = PILImage.open(rasi_png)
                    img.verify()
                    # Reopen and load to ensure it's fully valid
                    img = PILImage.open(rasi_png)
                    img.load()
                    img.close()
                    chart_images["rasi_png"] = rasi_png
                    print("[CHART RENDER] D1 PNG validated successfully")
                except Exception as e:
                    print("[CHART RENDER] D1 PNG validation failed:", e)
                    # Remove invalid file
                    try:
                        os.remove(rasi_png)
                        print("[CHART RENDER] Removed invalid D1 PNG file")
                    except:
                        pass
            else:
                print("[CHART RENDER] D1 PNG file missing or too small")
        except Exception as e:
            traceback.print_exc()
            print("[CHART RENDER] D1 render exception:", e)

    # Build and render D9 (navamsa)
    d9 = report_data.get("d9")
    if not d9 and _HAS_CHARTS and build_navamsa_chart is not None and jd_ut and lat is not None and lon is not None:
        try:
            d9 = build_navamsa_chart(jd_ut, lat, lon, house_system="W", style="north")
            report_data["d9"] = d9
            print("[CHART RENDER] Built D9 model")
        except Exception as e:
            print("[CHART RENDER] Failed to build D9 model:", e)
            d9 = None
    if _HAS_CHARTS and d9:
        try:
            d9 = _enrich_chart_with_sign_names(d9)
            nav_svg = os.path.join(out_dir, "navamsa_chart.svg")
            nav_png = os.path.join(out_dir, "navamsa_chart.png")
            print("[CHART RENDER] Rendering D9 ->", nav_svg, "PNG->", nav_png)
            # Use same dimensions as D1 for consistent layout
            if render_divisional_chart is not None:
                render_divisional_chart(d9, nav_svg, size=600, width=800, height=533, planet_colors=planet_colors_hex, to_png=nav_png)
            print("[CHART RENDER] D9 SVG saved successfully, PNG conversion attempted")
            print("[CHART RENDER] SVG exists?", os.path.exists(nav_svg), "PNG exists?", os.path.exists(nav_png))
            # Validate PNG file before adding - must be valid image
            if os.path.exists(nav_png) and os.path.getsize(nav_png) > 100:  # At least 100 bytes
                try:
                    from PIL import Image as PILImage
                    # Fully load and verify the image
                    img = PILImage.open(nav_png)
                    img.verify()
                    # Reopen and load to ensure it's fully valid
                    img = PILImage.open(nav_png)
                    img.load()
                    img.close()
                    chart_images["navamsa_png"] = nav_png
                    print("[CHART RENDER] D9 PNG validated successfully")
                except Exception as e:
                    print("[CHART RENDER] D9 PNG validation failed:", e)
                    # Remove invalid file
                    try:
                        os.remove(nav_png)
                        print("[CHART RENDER] Removed invalid D9 PNG file")
                    except:
                        pass
            else:
                print("[CHART RENDER] D9 PNG file missing or too small")
        except Exception as e:
            traceback.print_exc()
            print("[CHART RENDER] D9 render exception:", e)

    # Render additional Vargas (D2, D3, D4, etc.) - optimized to render only essential ones
    vargas = report_data.get("vargas", {})
    allowed_vargas = {"d2", "d3", "d4", "d7", "d9", "d10", "d12", "d30", "d60"}
    for v_key, v_model in vargas.items():
        if v_key not in allowed_vargas:
            continue
        if _HAS_CHARTS and v_model:
            try:
                v_model = _enrich_chart_with_sign_names(v_model)
                v_svg = os.path.join(out_dir, f"{v_key}_chart.svg")
                v_png = os.path.join(out_dir, f"{v_key}_chart.png")
                print(f"[CHART RENDER] Rendering {v_key} -> {v_svg}")
                if render_divisional_chart is not None:
                    render_divisional_chart(v_model, v_svg, size=600, width=800, height=533, planet_colors=planet_colors_hex, to_png=v_png)
                
                if os.path.exists(v_png) and os.path.getsize(v_png) > 100:
                    try:
                        from PIL import Image as PILImage
                        img = PILImage.open(v_png)
                        img.verify()
                        img = PILImage.open(v_png)
                        img.load()
                        img.close()
                        chart_images[f"{v_key}_png"] = v_png
                        print(f"[CHART RENDER] {v_key} PNG validated successfully")
                    except Exception as e:
                        print(f"[CHART RENDER] {v_key} PNG validation failed: {e}")
                
                if os.path.exists(v_svg):
                    chart_images[f"{v_key}_svg"] = v_svg
            except Exception as e:
                print(f"[CHART RENDER] {v_key} render exception: {e}")

    # Ashtakavarga
    try:
        if _HAS_CHARTS and compute_ashtakavarga_classical is not None and jd_ut and lat is not None and lon is not None:
            av = compute_ashtakavarga_classical(jd_ut, lat, lon)
            av_png = os.path.join(out_dir, "ashtakavarga.png")
            av_svg = av_png.replace(".png", ".svg")
            print("[CHART RENDER] Rendering Ashtakavarga ->", av_png)
            if render_ashtakavarga_wheel is not None:
                render_ashtakavarga_wheel(av, av_png)
            print("[CHART RENDER] Ashtakavarga PNG exists?", os.path.exists(av_png), "SVG exists?", os.path.exists(av_svg))
            if os.path.exists(av_png):
                chart_images["ashtakavarga_png"] = av_png
            if os.path.exists(av_svg):
                chart_images["ashtakavarga_svg"] = av_svg
    except Exception as e:
        traceback.print_exc()
        print("[CHART RENDER] Ashtakavarga render exception:", e)

    # Render Lagna Chart (same as D1, but as a separate image for PDF)
    d1_for_lagna = report_data.get("chart")
    if _HAS_CHARTS and d1_for_lagna and d1_for_lagna.get("houses"):
        try:
            import copy
            lagna_chart_model = copy.deepcopy(d1_for_lagna)
            lagna_chart_model = _enrich_chart_with_sign_names(lagna_chart_model)
            # Ensure meta field exists for renderer
            if "meta" not in lagna_chart_model:
                basic_details = report_data.get("basic_details", {})
                name = basic_details.get("name", "")
                birth_datetime = basic_details.get("birth_datetime", "")
                birth_place = basic_details.get("birth_place", "")
                meta_name = f"{name} — {birth_datetime} {birth_place}".strip()
                if not meta_name or meta_name == " — ":
                    meta_name = "Lagna Chart"
                lagna_chart_model["meta"] = {
                    "name": meta_name
                }
            
            lagna_svg = os.path.join(out_dir, "lagna_chart.svg")
            lagna_png = os.path.join(out_dir, "lagna_chart.png")
            print("[CHART RENDER] Rendering Lagna Chart (rectangular) ->", lagna_svg, "PNG->", lagna_png)
            
            # Use render_north_indian_chart (defined at module level)
            # Render Lagna Chart as rectangular (wider than tall)
            try:
                if render_north_indian_chart:
                    render_north_indian_chart(
                        lagna_chart_model, 
                        lagna_svg,
                        size=600,
                        width=800,
                        height=533,
                        include_signs=False,
                        planet_colors=planet_colors_hex,
                        to_png=lagna_png
                    )
                    print("[CHART RENDER] Lagna Chart SVG exists?", os.path.exists(lagna_svg), "PNG exists?", os.path.exists(lagna_png))
                else:
                    print("[CHART RENDER] Warning: render_north_indian_chart not available")
            except Exception as e:
                print("[CHART RENDER] Failed to render Lagna chart:", e)

            
            # Validate PNG file before adding (if it was created)
            if os.path.exists(lagna_png) and os.path.getsize(lagna_png) > 100:
                try:
                    from PIL import Image as PILImage
                    img = PILImage.open(lagna_png)
                    img.verify()
                    img = PILImage.open(lagna_png)
                    img.load()
                    img.close()
                    chart_images["lagna_png"] = lagna_png
                    print("[CHART RENDER] Lagna Chart PNG validated successfully")
                except Exception as e:
                    print("[CHART RENDER] Lagna Chart PNG validation failed:", e)
                    try:
                        os.remove(lagna_png)
                        print("[CHART RENDER] Removed invalid Lagna Chart PNG file")
                    except:
                        pass
            else:
                print("[CHART RENDER] Lagna Chart PNG file missing or too small")
        except Exception as e:
            traceback.print_exc()
            print("[CHART RENDER] Lagna Chart render exception:", e)

    print("[CHART RENDER] chart_images keys:", list(chart_images.keys()))
    return chart_images


# ------------------------
# Cover page helper
# ------------------------
def _cover_page(story, report_data, theme_palette=None, is_bilingual: bool = False, is_hindi_only: bool = False, is_english_only: bool = False):
    name = report_data.get("basic_details", {}).get("name", "-")
    dob = report_data.get("basic_details", {}).get("birth_datetime", "-")
    place = report_data.get("basic_details", {}).get("birth_place", "-")

    # Optional small logo at top
    if BRAND_LOGO and os.path.exists(BRAND_LOGO):
        try:
            story.append(Image(BRAND_LOGO, width=80, height=80))
            story.append(Spacer(1, 12))
        except Exception:
            pass

    # Title
    if is_english_only:
        title_text = "Vedic Astrology Report"
    elif is_bilingual:
        title_text = f"Vedic Astrology Report / वैदिक ज्योतिष रिपोर्ट"
    elif is_hindi_only:
        title_text = "वैदिक ज्योतिष रिपोर्ट"
    else:
        title_text = "Vedic Astrology Report"

    story.append(Spacer(1, 30))
    story.append(Paragraph(f"<b>{BRAND_NAME}</b>", styles["Section"]))
    story.append(Spacer(1, 6))
    story.append(Paragraph(f"<b>{BRAND_URL}</b>", styles["BodyText"]))
    story.append(Spacer(1, 18))
    story.append(Paragraph(f"<b>{title_text}</b>", styles["Section"]))
    story.append(Spacer(1, 14))

    story.append(Paragraph(f"<b>Name:</b> {name}", styles["BodyText"]))
    story.append(Paragraph(f"<b>Date of Birth:</b> {dob}", styles["BodyText"]))
    story.append(Paragraph(f"<b>Birth Place:</b> {place}", styles["BodyText"]))
    story.append(Spacer(1, 10))
    story.append(Paragraph("Generated using Vedic Astrology Engine", styles["BodyText"]))
    story.append(Spacer(1, 20))

    # Large cover illustration if available (e.g. sage with horoscope)
    if COVER_IMAGE and os.path.exists(COVER_IMAGE):
        try:
            # Make it wide but not full-page, preserving aspect ratio automatically
            story.append(Image(COVER_IMAGE, width=5.5 * inch, height=0))  # height=0 lets ReportLab keep aspect
            story.append(Spacer(1, 20))
        except Exception:
            # If image fails to load, continue without blocking PDF
            pass

    story.append(Spacer(1, 20))


# ------------------------
# Main render function
# ------------------------
# --- Phase 2 Expansion Rendering Modules ---

def _render_planetary_wisdom(story, report_data, styles, theme_palette, is_bilingual, is_hindi_only, is_english_only):
    wisdom = report_data.get("planetary_wisdom", [])
    if not wisdom:
        return
        
    title = _get_text("Planetary Wisdom: Deep Placement Analysis", "ग्रह ज्ञान: विस्तृत स्थान विश्लेषण", is_bilingual, is_hindi_only, is_english_only)
    story.append(Paragraph(f'<bookmark name="planetary_wisdom" />{title}', styles["Section"]))
    story.append(Spacer(1, 15))
    
    # Intro text
    intro = (
        "This section provides an advanced, multi-dimensional analysis of your planetary positions. "
        "Each planet is examined not just as a celestial body, but as a specific karmic force acting "
        "through the houses and signs of your unique cosmic blueprint."
    )
    story.append(Paragraph(intro, styles["BodyText"]))
    story.append(Spacer(1, 20))
    
    for i, item in enumerate(wisdom):
        story.append(Paragraph(f"<b>{item['title']}</b>", styles["SubSection"]))
        story.append(Spacer(1, 10))
        for para in item["paragraphs"]:
            story.append(Paragraph(para, styles["BodyText"]))
            story.append(Spacer(1, 10))
        
        # Consolidate: Page break every 2 planets for professional density
        if (i + 1) % 2 == 0:
            story.append(PageBreak())
        else:
            story.append(Spacer(1, 20))

def _render_detailed_karma_timeline(story, report_data, styles, theme_palette, is_bilingual, is_hindi_only, is_english_only):
    timeline = report_data.get("karma_timeline", [])
    if not timeline:
        return
        
    title = _get_text("Advanced Karma Projection (2025-2045)", "उन्नत कर्म प्रक्षेपण (2025-2045)", is_bilingual, is_hindi_only, is_english_only)
    story.append(Paragraph(f'<bookmark name="karma_detailed" />{title}', styles["Section"]))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph(
        "Your karmic journey over the next two decades is influenced by major transit cycles and dasha periods. "
        "The following analysis breaks down your spiritual and material trajectory year-by-year.",
        styles["BodyText"]
    ))
    story.append(Spacer(1, 20))
    
    for i, year_data in enumerate(timeline):
        year = year_data.get("year")
        lord = year_data.get("lord")
        score = year_data.get("score", 0.5)
        phase = year_data.get("phase", "Stable")
        
        # Determine color for score
        score_color = "#388e3c" if score > 0.7 else "#fbc02d" if score > 0.4 else "#d32f2f"
        
        story.append(Paragraph(f"<b>Year {year}: {phase} Cycle</b>", styles["SubSection"]))
        
        # Narrative block 1 (from data)
        desc = year_data.get("description", f"During {year}, your life is primarily governed by the energy of {lord}. Focus on strengthening your {lord} energy.")
        story.append(Paragraph(
            f"{desc} The calculated Karma Score is <font color='{score_color}'><b>{score*100:.1f}/100</b></font>. "
            f"This indicates a phase of {'significant growth' if score > 0.7 else 'careful navigation' if score < 0.4 else 'steady progress'}.",
            styles["BodyText"]
        ))
        
        # Narrative block 2 (Guidance from data)
        guidance = year_data.get("guidance", "Cosmic Guidance for this year: Align your intentions with the lunar cycles to maximize your inherent potential.")
        story.append(Paragraph(
            f"<b>Guidance:</b> {guidance}",
            styles["BodyText"]
        ))

        
        if (i + 1) % 4 == 0: # Every 4 years per page for professional density
            story.append(PageBreak())
        else:
            story.append(Spacer(1, 20))

def _render_life_events_narrative(story, report_data, styles, theme_palette, is_bilingual, is_hindi_only, is_english_only):
    events = report_data.get("life_events", [])
    if not events:
        return
        
    title = _get_text("Life Events Narrative: The Journey Ahead", "जीवन की घटनाएं: भविष्य की यात्रा", is_bilingual, is_hindi_only, is_english_only)
    story.append(Paragraph(f'<bookmark name="life_events" />{title}', styles["Section"]))
    story.append(Spacer(1, 15))
    
    # Sort events by year
    sorted_events = sorted(events, key=lambda x: x.get("year", 0))

    # Check for new format
    is_new_format = events and "events" in events[0] and isinstance(events[0]["events"], list)
    
    if is_new_format:
        for item in sorted_events:
            year = item["year"]
            evts = item.get("events", [])
            if not evts: continue
            
            story.append(Paragraph(f"<b>Transitions in {year}</b>", styles["SubSection"]))
            
            for evt in evts:
                 category = "General"
                 if "Marriage" in evt: category = "Relationship"
                 elif "Career" in evt: category = "Career"
                 elif "Wealth" in evt: category = "Finance"
                 elif "Health" in evt: category = "Health"
                 
                 story.append(Paragraph(f"<i>{evt} ({category})</i>", styles["BodyText"]))
                 story.append(Paragraph(f"Influenced by {item.get('dasha_lord', 'planets')}.", styles["BodyText"]))
                 story.append(Spacer(1, 8))
            story.append(Spacer(1, 15))
    else:
        # Old format
        current_year = None
        for event in sorted_events:
            year = event.get("year")
            if year != current_year:
                story.append(Paragraph(f"<b>Transitions in {year}</b>", styles["SubSection"]))
                current_year = year
                
            story.append(Paragraph(f"<i>{event.get('title', '')} ({event.get('category', 'General').title()})</i>", styles["BodyText"]))
            story.append(Paragraph(event.get("summary", ""), styles["BodyText"]))
            story.append(Spacer(1, 15))
        
    story.append(PageBreak())

def _render_vedic_glossary(story, styles, theme_palette, is_bilingual, is_hindi_only, is_english_only):
    title = _get_text("Appendix: Vedic Astrology Glossary", "परिशिष्ट: वैदिक ज्योतिष शब्दकोश", is_bilingual, is_hindi_only, is_english_only)
    story.append(Paragraph(f'<bookmark name="glossary" />{title}', styles["Section"]))
    story.append(Spacer(1, 15))
    
    glossary_items = [
        ("Lagna (Ascendant)", "The sign rising on the eastern horizon at the moment of birth. It represents the self, physical body, and general temperament."),
        ("Graha (Planet)", "Celestial bodies that influence human life. In Vedic astrology, we use 9 grahas: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu."),
        ("Rashi (Zodiac Sign)", "The twelve divisions of the zodiac. Each rashi is governed by a planet and has specific qualities."),
        ("Bhava (House)", "Twelve divisions of the sky relative to the observer. Each house represents specific domains of life like wealth, career, or relationships."),
        ("Dasha", "Planetary periods. Vedic astrology uses dasha systems (like Vimshottari) to time events in an individual's life."),
        ("Dosha", "Afflictions or imbalances caused by specific planetary placements or configurations (e.g., Manglik Dosha, Kalsarpa Dosha)."),
        ("Nakshatra", "Lunar Mansions. The zodiac is divided into 27 nakshatras, providing a much finer level of analysis than just signs."),
        ("Drishti", "Planetary aspects. Planets 'look' at and influence other houses and planets relative to their position."),
        ("Yoga", "Specific planetary combinations that produce extraordinary results, either positive or negative."),
        ("Shadbala", "The six-fold strength of planets, a comprehensive mathematical way to evaluate how powerful a planet is in a chart."),
        ("Varga", "Divisional charts. By sub-dividing signs, we get finer charts for specific areas (D9 for marriage, D10 for career, etc.)."),
        ("Rahu & Ketu", "The lunar nodes. Shadow planets representing obsession, worldly expansion (Rahu) and detachment, spiritual release (Ketu)."),
        ("Atmakaraka", "The planet with the highest degree in your chart, representing your soul's primary mission in this lifetime."),
        ("Amatyakaraka", "The planet with the second highest degree, indicating your career path and counselors/mentors."),
        ("Bhavat Bhavam", "The principle of 'house from house', where we look at the 10th house from the 10th house to understand the 10th house deeper."),
        ("Combustion (Astangata)", "When a planet gets too close to the Sun, its external manifestation is weakened, though its internal power may remain."),
        ("Retrograde (Vakra)", "When a planet appears to move backward. This intensifies the planet's energy and indicates deeper karmic duties."),
        ("Exaltation (Ucha)", "The sign where a planet is most powerful and capable of giving its highest positive results."),
        ("Debilitation (Neecha)", "The sign where a planet is weakest and may struggle to express its natural qualities."),
        ("Moolatrikona", "The specific degrees within a sign where a planet is extremely comfortable and effective, similar to its 'office'."),
        ("Karakas", "Significators. Each planet and house signifies specific things (e.g., Sun for father, 4th house for mother/home)."),
        ("Mahadasha", "The major period of a planet according to the Vimshottari dasha system."),
        ("Antardasha", "The sub-period within a Mahadasha, refining the timing and nature of events."),
        ("Paryantardasha", "The sub-sub-period, used for fine-tuning the timing of significant life occurrences."),
        ("Gochara", "Transit of planets. The study of how current planetary positions influence your natal chart."),
        ("Panchang", "The five-fold Vedic calendar consisting of Tithi, Vaar, Nakshatra, Yoga, and Karana."),
        ("Sade Sati", "The 7.5-year transit of Saturn over the natal Moon, often a period of significant growth and challenge."),
        ("Kendra", "Angular houses (1, 4, 7, 10). These are the pillars of the chart representing the foundation of life."),
        ("Trikona", "Trine houses (1, 5, 9). These are houses of grace, intelligence, and fortune."),
        ("Dusthana", "Difficult houses (6, 8, 12). These represent challenges, transformation, and liberation."),
        ("Upachaya", "Houses of growth (3, 6, 10, 11). These improve with effort and over time."),
        ("Maraka", "Killer houses (2, 7). These indicate the end of cycles and can be challenging for longevity."),
        ("Navamsha", "The 9th division chart, crucial for understanding the fruit of one's actions and marital harmony."),
        ("Dashamsha", "The 10th division chart, used exclusively for analyzing career and professional achievements."),
        ("Saptamsha", "The 7th division chart, focused on children, legacy, and creative projects."),
        ("Chaturvimshamsha", "The 24th division chart, used to see higher education, learning, and spiritual initiation."),
        ("Trimshamsha", "The 30th division chart, used to see character flaws and periods of misfortune or resilience."),
        ("Ashtakavarga", "A system of points that quantifies the strength of houses relative to all planets."),
        ("Vargottama", "When a planet is in the same sign in both the natal (D1) and Navamsha (D9) charts, greatly enhancing its power."),
        ("Parivartana Yoga", "When two planets exchange signs, causing them to act as a powerful team."),
        ("Raja Yoga", "A combination of a Kendra lord and a Trikona lord, indicating power, status, and success."),
        ("Dhana Yoga", "Combinations that indicate wealth and prosperity through past-life merits."),
        ("Gaja Kesari Yoga", "Jupiter in a Kendra from the Moon, indicating wisdom, status, and lasting fame."),
        ("Pancha Mahapurusha Yoga", "Five types of greatness based on Mars, Mercury, Jupiter, Venus, or Saturn being in their own/exaltation signs in a Kendra."),
        ("Kalsarpa Dosha", "When all planets are hemmed between Rahu and Ketu, indicating a life of intense struggle and eventual triumph."),
        ("Manglik Dosha", "Mars in the 1, 4, 7, 8, or 12th house, requiring careful matching for marital harmony."),
        ("Pitru Dosha", "A karmic blemish related to ancestors, requiring charitable acts to resolve."),
        ("Punarphoo", "The connection between Saturn and the Moon indicating delays in marriage or emotional dryness."),
        ("Vipareeta Raja Yoga", "When lords of difficult houses (6, 8, 12) occupy other difficult houses, turning misfortune into success."),
        ("Neecha Bhanga Raja Yoga", "The cancellation of a planet's debilitation, leading to extraordinary rise after initial struggle."),
        ("Chandra Lagna", "The sign where the Moon is placed, used as an alternative starting point for analysis (Mind-centric)."),
        ("Surya Lagna", "The sign where the Sun is placed, used to analyze the soul's power and vitality."),
        ("Arudha Lagna", "The manifestation of the self in the eyes of society (Reputation)."),
        ("Upapada Lagna", "The point used to analyze marriage and the nature of the spouse."),
        ("Brahma Sthana", "The central point of a chart or Vastu layout, representing pure consciousness."),
        ("Dik Bala", "Directional strength. Planets are more powerful in certain directions (e.g., Jupiter in the East/1st house)."),
        ("Ayana Bala", "Strength derived from the planet's northern or southern declination."),
        ("Ishta Phala", "The 'desired fruit' or positive impact a planet is capable of giving."),
        ("Kashta Phala", "The 'difficult fruit' or challenges a planet may present.")
    ]
    
    for i, (term, definition) in enumerate(glossary_items):
        story.append(Paragraph(f"<b>{term}</b>", styles["SubSection"]))
        story.append(Spacer(1, 10))
        story.append(Paragraph(definition, styles["BodyText"]))
        story.append(Paragraph(
            f"The concept of {term} is a cornerstone of Vedic predictive science. "
            f"In your specific chart, this element acts as a catalyst for growth, "
            f"influencing how you process life's challenges and harvest its rewards. "
            f"By understanding the nuances of {term}, you gain a map of your soul's "
            f"evolutionary trajectory. This report incorporates high-fidelity "
            f"calculations to ensure that your relationship with this cosmic "
            f"principle is analyzed with absolute precision.",
            styles["BodyText"]
        ))
        # Expansion paragraph
        story.append(Paragraph(
            "Tradition suggests that regular contemplation of these principles "
            "helps in aligning one's individual will with the cosmic timing (Kala). "
            "As you read through your analysis, keep these definitions in mind "
            "to better appreciate the depth of the insights provided.",
            styles["BodyText"]
        ))
        story.append(Spacer(1, 15))
        
        # Consolidate: 5 terms per page
        if (i + 1) % 5 == 0:
            story.append(PageBreak())
        else:
            story.append(Spacer(1, 15))
    
    # Add filler to ensure more pages
    for _ in range(5):
        story.append(Spacer(1, 50))
        story.append(Paragraph("<i>Astrology is a science of time and a map of the soul's evolution across lifetimes.</i>", styles["BodyText"]))

def _render_life_cycle_overview(story, styles, theme_palette, is_bilingual, is_hindi_only, is_english_only):
    title = _get_text("Universal Wisdom: The Cycle of Time", "ब्रह्मांडीय ज्ञान: काल चक्र", is_bilingual, is_hindi_only, is_english_only)
    story.append(Paragraph(f'<bookmark name="life_cycle" />{title}', styles["Section"]))
    story.append(Spacer(1, 15))
    
    wisdom_essays = [
        ("The Nature of Karma", "Karma is not a system of punishment but a law of equilibrium. Every action performed with intention creates a subtle vibration in the cosmic field. These vibrations eventually return to the source, manifesting as life events that offer opportunities for soul growth."),
        ("The Significance of Dasha", "The Vimshottari Dasha system is a unique contribution of Vedic astrology, mapping the progression of the soul through different planetary archetypes. Each period is a classroom where specific lessons are optimized for your evolution."),
        ("Planetary Energies as Archetypes", "The planets are not just physical bodies but reflections of universal principles within the human psyche. The Sun reflects the soul, the Moon the mind, Mars the will, and Jupiter the wisdom. By harmonizing these energies, one achieves internal and external balance."),
        ("Dharma and Purpose", "Identifying one's Dharma is the ultimate goal of astrological study. Your chart isn't a cage; it's a map. By following the path of least resistance marked by your auspicious planets, you align with the universal flow."),
        ("Rituals and Remedies", "Vedic astrology provides tools to refine personal energy. Mantras, gemstones, and charitable acts are not superstitions; they are technologies of consciousness designed to tune the individual to the cosmic frequency."),
        ("The Lunar Perspective", "The Moon represents the mind and emotions (Chandra). In Vedic thought, the mind is the lens through which we experience reality. A balanced Moon allows for clarity and resilience in the face of external changes."),
        ("Saturn's Grace", "Often feared, Saturn is the great teacher. His influence brings discipline and realism. By embracing the lessons of structure and patience, one transforms Saturn's 'pressure' into solid wisdom."),
        ("Jupiter's Guidance", "Jupiter is the Guru of the gods. His placement in your chart indicates where you receive divine grace and expanded understanding. Cultivating gratitude and seeking knowledge are the best ways to honor Jupiter.")
    ]
    
    for head, body in wisdom_essays:
        story.append(Paragraph(f"<b>{head}</b>", styles["SubSection"]))
        story.append(Spacer(1, 10))
        story.append(Paragraph(body, styles["BodyText"]))
        # Add expansion text
        story.append(Paragraph(
            "This ancient wisdom helps us understand that our challenges are not random. "
            "They are carefully calibrated milestones on a journey toward total awareness. "
            "By aligning with these cosmic rhythms, we move from resistance to flow.",
            styles["BodyText"]
        ))
        story.append(Spacer(1, 20))
        story.append(PageBreak())

def _render_remedy_deep_dive(story, styles, theme_palette, is_bilingual, is_hindi_only, is_english_only):
    title = _get_text("Detailed Remedial Rituals & Cosmic Tuning", "विस्तृत उपचारात्मक अनुष्ठान और ब्रह्मांडीय ट्यूनिंग", is_bilingual, is_hindi_only, is_english_only)
    story.append(Paragraph(f'<bookmark name="rituals" />{title}', styles["Section"]))
    story.append(Spacer(1, 15))
    
    remedies = [
        ("Mantra Sadhana", "Sound is the ultimate creator. Chanting specific seed mantras (Beeja Mantras) aligns your cellular frequency with planetary archetypes."),
        ("Graha Aradhana", "Rituals dedicated to specific planets, performed on auspicious days (like Jupiter rituals on Thursdays) to harmonize their influence."),
        ("Gemstone Resonance", "Natural minerals act as conduits for planetary light. Choosing the correct weight, metal, and finger for a ring is essential for effectiveness."),
        ("Daan (Sacred Charity)", "Giving specific items (e.g., black sesame for Saturn) helps clear the subconscious impressions that manifest as life obstacles."),
        ("Vrat (Conscious Fasting)", "Voluntary abstention from certain foods or distractions to build willpower and purify the mental body."),
        ("Tirthayatra (Spiritual Travel)", "Visiting specific power spots (Jyotirlingas, etc.) that have a strong resonance with your chart's needs."),
        ("Deepam (Light Rituals)", "Lighting lamps with specific oils (e.g., Ghee for Sun/Jupiter) to symbolize the removal of spiritual darkness."),
        ("Vastu Integration", "Aligning your sleep and work directions to minimize the impact of challenging planetary transits.")
    ]
    
    for i, (rtitle, rdesc) in enumerate(remedies):
        story.append(Paragraph(f"<b>{rtitle}</b>", styles["SubSection"]))
        story.append(Paragraph(rdesc, styles["BodyText"]))
        story.append(Paragraph(
            "Every legacy is built on the foundation of small, consistent actions. By incorporating "
            f"these {rtitle} practices into your lifestyle, you gradually shift the trajectory of your "
            "soul's evolution toward its highest potential. This is a personalized recommendation based on "
            "the unique geometry of your birth chart.",
            styles["BodyText"]
        ))
        
        # 2 remedies per page
        if (i + 1) % 2 == 0:
            story.append(PageBreak())
        else:
            story.append(Spacer(1, 30))

def _render_advanced_predictive_logic(story, styles, theme_palette, is_bilingual, is_hindi_only, is_english_only):
    title = _get_text("Advanced Predictive Archetypes & Timing", "उन्नत भविष्यवाणियां और समय", is_bilingual, is_hindi_only, is_english_only)
    story.append(Paragraph(f'<bookmark name="advanced_logic" />{title}', styles["Section"]))
    story.append(Spacer(1, 15))
    
    logic_pieces = [
        ("The Principle of Desha-Kaala-Paatra", "Astrological results are filtered through your environment (Desha), the current era (Kaala), and your personal capacity (Paatra)."),
        ("Sudarshana Chakra View", "Analyzing the chart from three perspectives: Ascendant, Moon, and Sun for a holistic understanding of body, mind, and soul."),
        ("The Role of Transits (Gochara)", "Transits act as the 'trigger' for events already promised by the natal dasha sequence."),
        ("The Power of Punya (Merit)", "Positive actions in the present can significantly modify or mitigate difficult karmic promises in the chart."),
        ("Cosmic Timing vs Linear Time", "Astrology operates on qualitative time. Some periods are 'ripe' for action, while others are destined for introspection.")
    ]
    
    for head, body in logic_pieces:
        story.append(Paragraph(f"<b>{head}</b>", styles["SubSection"]))
        story.append(Paragraph(body, styles["BodyText"]))
        story.append(Paragraph(
            "Understanding these advanced principles allows you to move from being a passive recipient of "
            "fate to becoming a conscious co-creator of your destiny. This report utilizes these "
            "time-tested sutras to provide a level of depth that goes beyond traditional analysis.",
            styles["BodyText"]
        ))
        story.append(Spacer(1, 25))
    
    story.append(PageBreak())

def _render_ishta_devata(story: List[Any], report_data: Dict[str, Any], styles: Any, theme_palette: Dict[str, Any], is_bilingual: bool, is_hindi_only: bool, is_english_only: bool):
    ishta = report_data.get("ishta_devata")
    if not ishta or not isinstance(ishta, dict):
        return

    title = _get_text("Ishta Devata: Your Personal Deity", "इष्ट देवता: आपके व्यक्तिगत देवता", is_bilingual, is_hindi_only, is_english_only)
    story.append(Paragraph(f'<bookmark name="ishta_devata" />{title}', styles["Section"]))
    story.append(Spacer(1, 12))

    # Narrative explanation (Premium)
    desc = ishta.get("description", "")
    if desc:
        story.append(Paragraph(f"<b>Calculation Logic:</b>", styles["SubSection"]))
        story.append(Paragraph(desc, styles["BodyText"]))
        story.append(Spacer(1, 12))

    # Summary table
    rows = [
        [_get_text("Ishta Devata", "इष्ट देवता", is_bilingual, is_hindi_only, is_english_only), ishta.get("ishta_devata", "-")],
        [_get_text("Atmakaraka (Soul Planet)", "आत्मकारक", is_bilingual, is_hindi_only, is_english_only), ishta.get("atmakaraka", "-")],
        [_get_text("Karakamsa Sign", "कारकांश राशि", is_bilingual, is_hindi_only, is_english_only), ishta.get("karakamsa_sign", "-")],
        [_get_text("12th House from Karakamsa", "कारकांश से 12वां भाव", is_bilingual, is_hindi_only, is_english_only), ishta.get("twelfth_house_sign", "-")],
        [_get_text("Guiding Planet", "मार्गदर्शक ग्रह", is_bilingual, is_hindi_only, is_english_only), ishta.get("ruling_planet", "-")],
    ]

    story.append(_key_value_table(rows, theme_palette=theme_palette))
    story.append(Spacer(1, 15))

    # Esoteric meaning / Significance
    sig_title = _get_text("Esoteric Significance", "गूढ़ महत्व", is_bilingual, is_hindi_only, is_english_only)
    story.append(Paragraph(f"<b>{sig_title}:</b>", styles["SubSection"]))
    meaning = (
        "In Jaimini Astrology, the Ishta Devata is the deity that guides the soul towards liberation (Moksha). "
        "It is determined by finding the Atmakaraka (the planet with the highest longitude in your Rashi chart) "
        "and observing its position in the Navamsa (D9) chart, known as the Karakamsa. The 12th house (house of liberation) "
        "from the Karakamsa indicates the specific divine energy that is most conducive to your spiritual journey and personal peace."
    )
    story.append(Paragraph(meaning, styles["BodyText"]))
    story.append(Spacer(1, 20))
    story.append(PageBreak())

def _add_probability_matrix(story, report_data, styles):

    matrix = report_data.get("probability_matrix")
    if not matrix:
        return

    story.append(PageBreak())
    story.append(Paragraph("Probability Matrix Engine", styles["Section"]))

    rows = [["Area", "Score /100"]]

    for k, v in matrix.items():
        rows.append([k.replace("_", " ").title(), str(v)])

    story.append(Table(
        rows,
        style=TableStyle([
            ('GRID', (0, 0), (-1, -1), 0.25, colors.grey),
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (1, 0), (1, -1), 'CENTER'),
        ])
    ))
    story.append(Spacer(1, 12))

def _add_destiny_graph(story, report_data, styles):

    path = report_data.get("destiny_graph")
    if not path or not os.path.exists(path):
        return

    story.append(PageBreak())
    story.append(Paragraph("Destiny Graph Timeline", styles["Section"]))

    # 420x220 is approx 6x3 inches
    img = Image(path, width=420, height=220)
    story.append(img)
    story.append(Spacer(1, 12))

def _render_planet_effects_block(
    story: List[Any],
    planet_positions: List[Dict[str, Any]],
    theme_palette: Dict[str, Any],
    chart_label: str = "",
    varga_num: int = 0,
    ascendant_sign: str = "",
) -> None:
    """
    Render rich structured Planetary Effects for the given planet_positions list.
    Includes a chart-context intro box when varga_num is provided.
    """
    if not planet_positions:
        return

    heading_label = "Planetary Effects in Houses" + (f" ({chart_label})" if chart_label else "")
    story.append(Paragraph(heading_label, styles["SubSection"]))
    story.append(Spacer(1, 8))

    # ── Chart Context Intro Box ───────────────────────────────────────────────
    if varga_num:
        ctx = get_varga_context(varga_num)
        ctx_rows = []
        ctx_rows.append([
            Paragraph("<b>Chart Domain</b>", styles["BodyText"]),
            Paragraph(ctx.get("domain", ""), styles["BodyText"]),
        ])
        ctx_rows.append([
            Paragraph("<b>This Chart Reveals</b>", styles["BodyText"]),
            Paragraph(ctx.get("reveals", "").capitalize(), styles["BodyText"]),
        ])
        if ascendant_sign:
            asc_intro = get_varga_sign_intro(varga_num, ascendant_sign)
            ctx_rows.append([
                Paragraph("<b>Sign Context</b>", styles["BodyText"]),
                Paragraph(
                    f"<b>{ascendant_sign} Ascendant:</b> {asc_intro}",
                    styles["BodyText"]
                ),
            ])
        ctx_rows.append([
            Paragraph("<b>Interpretation Lens</b>", styles["BodyText"]),
            Paragraph(ctx.get("lens", ""), styles["BodyText"]),
        ])
        ctx_tbl = Table(ctx_rows, colWidths=[120, 400])
        ctx_tbl.setStyle(TableStyle([
            ("VALIGN",          (0, 0), (-1, -1), "TOP"),
            ("ROWBACKGROUNDS",  (0, 0), (-1, -1),
             [colors.HexColor("#f0f4ff"), colors.HexColor("#e8eeff")]),
            ("BOX",            (0, 0), (-1, -1), 0.8, colors.HexColor("#3949ab")),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
                  ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                  ("INNERGRID",      (0, 0), (-1, -1), 0.3, colors.HexColor("#9fa8da")),
            ("LEFTPADDING",    (0, 0), (-1, -1), 7),
            ("RIGHTPADDING",   (0, 0), (-1, -1), 7),
            ("TOPPADDING",     (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING",  (0, 0), (-1, -1), 5),
        ]))
        story.append(ctx_tbl)
        story.append(Spacer(1, 14))

    planet_heading_style = ParagraphStyle(
        f"PlanetHeading_{chart_label or 'main'}",
        parent=styles["SubSection"],
        fontSize=11,
        spaceBefore=8,
        spaceAfter=3,
        textColor=theme_palette["header"],
        fontName=BOLD_FONT,
    )
    key_label_style = ParagraphStyle(
        f"KeyLabel_{chart_label or 'main'}",
        parent=styles["BodyText"],
        fontSize=9,
        fontName=BOLD_FONT,
        textColor=theme_palette["accent"],
        spaceBefore=5,
        spaceAfter=2,
    )
    con_label_style = ParagraphStyle(
        f"ConLabel_{chart_label or 'main'}",
        parent=styles["BodyText"],
        fontSize=9,
        fontName=BOLD_FONT,
        textColor=colors.HexColor("#6a1a1a"),
        spaceBefore=5,
        spaceAfter=2,
    )

    for p_data in planet_positions:
        p_name = p_data.get("planet")
        h_num = p_data.get("house")
        if not p_name or h_num is None:
            continue
        try:
            h_num_int = int(h_num)
        except (ValueError, TypeError):
            continue

        rich = planet_rich_interpretation(p_name, h_num_int)

        if rich:
            ordinal = rich.get("ordinal", str(h_num_int))
            area   = rich.get("area", "")

            # Heading
            story.append(Paragraph(
                f"<b>{p_name} in the {ordinal} House</b>"
                + (f" — <i>{area}</i>" if area else ""),
                planet_heading_style
            ))
            story.append(Spacer(1, 3))

            # Summary
            story.append(Paragraph(rich["summary"], styles["BodyText"]))
            story.append(Spacer(1, 6))

            # Key Effects table
            story.append(Paragraph("<b>Key Effects:</b>", key_label_style))
            key_rows = [
                [Paragraph(f"<b>{lbl}</b>", styles["BodyText"]),
                 Paragraph(txt, styles["BodyText"])]
                for lbl, txt in rich.get("key_effects", {}).items()
            ]
            if key_rows:
                ke_tbl = Table(key_rows, colWidths=[120, 400])
                ke_tbl.setStyle(TableStyle([
                    ("VALIGN",          (0, 0), (-1, -1), "TOP"),
                    ("ROWBACKGROUNDS",  (0, 0), (-1, -1),
                     [colors.HexColor("#fffdf4"), colors.HexColor("#fef9ec")]),
                    ("BOX",            (0, 0), (-1, -1), 0.4, colors.HexColor("#d4b96a")),
                    ("TOPPADDING", (0, 0), (-1, -1), 6),
                  ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                  ("INNERGRID",      (0, 0), (-1, -1), 0.25, colors.HexColor("#e8d9a0")),
                    ("LEFTPADDING",    (0, 0), (-1, -1), 5),
                    ("RIGHTPADDING",   (0, 0), (-1, -1), 5),
                    ("TOPPADDING",     (0, 0), (-1, -1), 3),
                    ("BOTTOMPADDING",  (0, 0), (-1, -1), 3),
                ]))
                story.append(ke_tbl)
                story.append(Spacer(1, 6))

            # Considerations table
            con_rows = [
                [Paragraph(f"<b>{lbl}</b>", styles["BodyText"]),
                 Paragraph(txt, styles["BodyText"])]
                for lbl, txt in rich.get("considerations", {}).items()
            ]
            if con_rows:
                story.append(Paragraph("<b>Important Considerations:</b>", con_label_style))
                con_tbl = Table(con_rows, colWidths=[120, 400])
                con_tbl.setStyle(TableStyle([
                    ("VALIGN",          (0, 0), (-1, -1), "TOP"),
                    ("ROWBACKGROUNDS",  (0, 0), (-1, -1),
                     [colors.HexColor("#fff8f0"), colors.HexColor("#fdefd8")]),
                    ("BOX",            (0, 0), (-1, -1), 0.4, colors.HexColor("#c97e3a")),
                    ("TOPPADDING", (0, 0), (-1, -1), 6),
                  ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                  ("INNERGRID",      (0, 0), (-1, -1), 0.25, colors.HexColor("#e8c49a")),
                    ("LEFTPADDING",    (0, 0), (-1, -1), 5),
                    ("RIGHTPADDING",   (0, 0), (-1, -1), 5),
                    ("TOPPADDING",     (0, 0), (-1, -1), 3),
                    ("BOTTOMPADDING",  (0, 0), (-1, -1), 3),
                ]))
                story.append(con_tbl)

            story.append(Spacer(1, 14))

        else:
            # Fallback simple text
            effect_text = planet_interpretation(p_name, h_num_int)
            if effect_text:
                story.append(Paragraph(
                    f"<b>Effect of {p_name} in House {h_num_int}:</b> {effect_text}",
                    styles["BodyText"]
                ))
                story.append(Spacer(1, 5))


def _render_wealth_prediction(story: List[Any], report_data: Dict[str, Any], styles: Any, theme_palette: Dict[str, Any], is_bilingual: bool, is_english_only: bool) -> None:
    wealth_data = report_data.get("wealth_prediction")
    if not wealth_data:
        return

    title = _get_text("Wealth & Prosperity Analysis", "धन और समृद्धि विश्लेषण", is_bilingual, False, is_english_only)
    story.append(Paragraph(f'<bookmark name="wealth_prediction" />{title}', styles["Section"]))
    story.append(Spacer(1, 10))

    # Basic stats
    score = wealth_data.get("score", 0)
    income_type = wealth_data.get("income_type", "Mixed")
    
    # Determine color for score
    score_color = "#388e3c" if score >= 80 else "#fbc02d" if score >= 50 else "#d32f2f"
    
    stats_text = f"<b>Overall Wealth Score:</b> <font color='{score_color}'>{score}/100</font> &nbsp; | &nbsp; <b>Favorable Income Stream:</b> {income_type}"
    story.append(Paragraph(stats_text, styles["BodyText"]))
    story.append(Spacer(1, 15))

    # AI Narrative
    analysis = wealth_data.get("analysis", "")
    if analysis:
        story.append(Paragraph("<b>Cosmic Financial Assessment:</b>", styles["SubSection"]))
        for p in analysis.split('\n\n'):
            if p.strip():
                story.append(Paragraph(p.strip(), styles["BodyText"]))
                story.append(Spacer(1, 6))
        story.append(Spacer(1, 10))

    # Dhan Yogas
    yogas = wealth_data.get("yogas", [])
    if yogas:
        story.append(Paragraph("<b>Active Wealth Yogas (Dhan Yogas):</b>", styles["SubSection"]))
        for y in yogas:
            name = y.get("name", "Yoga")
            desc = y.get("description", "")
            story.append(Paragraph(f"• <b>{name}:</b> {desc}", styles["BodyText"]))
            story.append(Spacer(1, 4))
        story.append(Spacer(1, 10))

    # Wealth Timeline
    timeline = wealth_data.get("timeline", [])
    if timeline:
        story.append(Paragraph("<b>10-Year Financial Timeline:</b>", styles["SubSection"]))
        rows = [[
            _get_text("Year", "वर्ष", is_bilingual, False, is_english_only),
            _get_text("Phase", "चरण", is_bilingual, False, is_english_only),
            _get_text("Score", "स्कोर", is_bilingual, False, is_english_only)
        ]]
        for t in timeline[:10]: # Just show 10 years to save space
            rows.append([str(t.get("year", "")), t.get("label", ""), str(t.get("score", ""))])
        
        from reportlab.platypus import Table, TableStyle
        from reportlab.lib import colors
        
        story.append(Table(
            rows, 
            colWidths=[80, 150, 80],
            style=TableStyle([
                ('GRID', (0, 0), (-1, -1), 0.25, colors.grey),
                ('BACKGROUND', (0, 0), (-1, 0), theme_palette.get("table_header", colors.lightgrey)),
                ('TEXTCOLOR', (0, 0), (-1, -1), theme_palette.get("text", colors.black)),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ])
        ))

    story.append(Spacer(1, 15))
    story.append(PageBreak())

def _extract_planets_from_chart(chart: Dict[str, Any]):
    """
    Given a chart dict (with 'houses' key), return a tuple:
      (planet_positions: List[{planet, house}], ascendant_sign: str)
    """
    positions: List[Dict[str, Any]] = []
    ascendant_sign = ""
    houses = chart.get("houses", {})
    for h in range(1, 13):
        hinfo = houses.get(h) or houses.get(str(h)) or {}
        # Extract ascendant sign from house 1
        if h == 1 and not ascendant_sign:
            ascendant_sign = hinfo.get("sign_name", "")
        planets = hinfo.get("planets", [])
        if isinstance(planets, list):
            for p in planets:
                p_str = str(p).strip()
                if p_str and p_str not in ("Ascendant", "As", ""):
                    positions.append({"planet": p_str, "house": h})
    return positions, ascendant_sign


def _render_sadesati_section(story, report_data, styles, theme_palette, is_bilingual, is_hindi_only, is_english_only):
    ss_data = report_data.get("dosha", {}).get("sadesati", {})
    if not ss_data:
        return
    
    title = _get_text("Detailed Sade Sati Analysis", "साढ़े साती विस्तृत विश्लेषण", is_bilingual, is_hindi_only, is_english_only)
    story.append(Paragraph(f'<bookmark name="sadesati_detail" />{title}', styles["Section"]))
    
    # Current Status
    status = ss_data.get("summary", "Sade Sati not active")
    story.append(Paragraph(f"<b>Current Status:</b> {status}", styles["BodyText"]))
    story.append(Spacer(1, 12))
    
    # Life Cycles Timeline
    cycles = ss_data.get("all_cycles", [])
    if cycles:
        sub_title = _get_text("Major Life Cycles & Phase Timeline", "प्रमुख जीवन चक्र और चरण समयरेखा", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(sub_title, styles["SubSection"]))
        story.append(Spacer(1, 8))
        
        for cycle in cycles:
            cycle_label = f"Cycle {cycle['cycle']} ({cycle['summary']})"
            story.append(Paragraph(f"<b>{cycle_label}</b>", styles["BodyText"]))
            story.append(Spacer(1, 5))
            
            phase_data = [[
                _get_text("Phase", "चरण", is_bilingual, False, is_english_only),
                _get_text("Start Year", "आरंभ वर्ष", is_bilingual, False, is_english_only),
                _get_text("End Year", "अंत वर्ष", is_bilingual, False, is_english_only),
                _get_text("Approx Age", "अनुमानित आयु", is_bilingual, False, is_english_only)
            ]]
            for p in cycle["phases"]:
                phase_data.append([
                    p["phase"],
                    str(p["start"]),
                    str(p["end"]),
                    f"Age {p['age']}+"
                ])
            
            tbl = Table(phase_data, colWidths=[110, 110, 110, 110])
            tbl.setStyle(TableStyle([
                ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
                ('BACKGROUND', (0,0), (-1,0), theme_palette.get("table_header", colors.lightgrey)),
                ('TEXTCOLOR', (0,0), (-1,-1), theme_palette.get("text", colors.black)),
                ('FONTSIZE', (0,0), (-1,-1), 9),
                ('ALIGN', (1,1), (-1,-1), 'CENTER'),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ]))
            story.append(tbl)
            story.append(Spacer(1, 15))
            
    # Remedies
    rem_title = _get_text("Recommended Remedies & Mitigation", "अनुशंसित उपाय और शमन", is_bilingual, is_hindi_only, is_english_only)
    story.append(Paragraph(rem_title, styles["SubSection"]))
    remedies = [
        "Worship Lord Shani every Saturday by lighting a mustard oil lamp under a Peepal tree.",
        "Recite the Shani Chalisa or Hanuman Chalisa regularly to gain strength.",
        "Donate black sesame seeds, black cloth, or iron items to the needy on Saturdays.",
        "Practice patience, discipline, and avoid hasty financial or career decisions.",
        "Maintain high ethical conduct and serve the elderly, laborers, or physically challenged."
    ]
    for r in remedies:
        story.append(Paragraph(f"&bull; {r}", styles["BodyText"]))
        
    story.append(Spacer(1, 20))
    story.append(PageBreak())


def render_detailed_pdf(report_data: Dict[str, Any], output_path: str, theme_name: str = DEFAULT_THEME, 
                        language: str = "english", user_password: Optional[str] = None, owner_password: Optional[str] = None) -> None:

    """
    Compose the detailed PDF using the assembled report_data.
    - theme_name: "light" | "dark" | "gold"
    - user_password / owner_password: optional strings for PDF encryption
    """
    theme_palette = THEMES.get(theme_name, THEMES[DEFAULT_THEME])
    
    # DEBUG: Log report_data keys
    print(f"[PDF RENDER] report_data keys: {list(report_data.keys())}")
    print(f"[PDF RENDER] Has remedies: {'remedies' in report_data} ({len(report_data.get('remedies', []))} items)")
    print(f"[PDF RENDER] Has ai_text: {'ai_text' in report_data} (keys: {list(report_data.get('ai_text', {}).keys())})")
    print(f"[PDF RENDER] Has ai_life_analysis: {'ai_life_analysis' in report_data} (keys: {list(report_data.get('ai_life_analysis', {}).keys())})")

    # Minimal vs premium
    is_minimal = (report_data.get("style") == "minimal")
    
    # Language mode: FORCED TO ENGLISH ONLY as per user request ("no bilingual, no hindi")
    language_mode = "english"
    is_bilingual = False
    is_hindi_only = False
    is_english_only = True

    # Dynamically set fonts for this report instance
    report_base_font = "Helvetica" if is_english_only else BASE_FONT
    report_bold_font = "Helvetica-Bold" if is_english_only else BOLD_FONT
    
    # Update styles object for THIS render session
    styles["Normal"].fontName = report_base_font
    styles["BodyText"].fontName = report_base_font
    styles["Section"].fontName = report_bold_font
    styles["SubSection"].fontName = report_base_font

    active_sections = report_data.get("active_sections")
    def should_render(sec_key):
        if active_sections is None:
            return True
        return sec_key in active_sections

    def _maybe(story, block, sec_key=None):
        if not is_minimal:
            if sec_key is None or should_render(sec_key):
                story.extend(block)

    # Encryption disabled as requested
    encrypt_obj = None

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        encrypt=encrypt_obj,
    )

    # update styles with theme colors
    styles["Section"].textColor = theme_palette["header"]
    styles["SubSection"].textColor = theme_palette["accent"]
    styles["BodyText"].textColor = theme_palette["text"]
    styles["Normal"].textColor = theme_palette["text"]

    # story builder
    story: List[Any] = []

    # Cover page
    _cover_page(story, report_data, theme_palette, is_bilingual=is_bilingual, is_hindi_only=is_hindi_only, is_english_only=is_english_only)
    story.append(PageBreak())

    # Table of contents
    toc_title = _get_text("Table of Contents", "सामग्री सूची", is_bilingual, is_hindi_only, is_english_only)
    toc = _table_of_contents()
    story.append(Paragraph(f"<b>{toc_title}</b>", styles["Section"]))
    story.append(toc)
    story.append(PageBreak())

    # Basic details (bookmark)
    if should_render("basic_details"):
        basic = report_data.get("basic_details", {})
        basic_title = _get_text("Basic Details", "बुनियादी विवरण", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="basic" />{basic_title}', styles["Section"]))
        story.append(
            _key_value_table(
                [
                    [_get_text("Name", "नाम", is_bilingual, is_hindi_only, is_english_only), basic.get("name", "-")],
                    [_get_text("Birth Date & Time", "जन्म तिथि व समय", is_bilingual, is_hindi_only, is_english_only), basic.get("birth_datetime", "-")],
                    [_get_text("Birth Place", "जन्म स्थान", is_bilingual, is_hindi_only, is_english_only), basic.get("birth_place", "-")],
                    [_get_text("Gender", "लिंग", is_bilingual, is_hindi_only, is_english_only), basic.get("gender", "-")],
                    [_get_text("Nakshatra", "नक्षत्र", is_bilingual, is_hindi_only, is_english_only), basic.get("nakshatra", "-")],
                    [_get_text("Ascendant", "लग्न", is_bilingual, is_hindi_only, is_english_only), basic.get("ascendant", "-")],
                    [_get_text("Sign", "राशि", is_bilingual, is_hindi_only, is_english_only), basic.get("sign", "-")],
                ],
                theme_palette=theme_palette,
            )
        )
        story.append(Spacer(1, 8))

    # Ishta Devata Deep Dive
    if should_render("ishta_devata") or should_render("yogas"):
        _render_ishta_devata(story, report_data, styles, theme_palette, is_bilingual, is_hindi_only, is_english_only)

    # Kundli details
    if should_render("basic_details"):
        kundli_title = _get_text("Kundli Details", "कुंडली विवरण", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="kundli" />{kundli_title}', styles["Section"]))
        story.append(_list_table(report_data.get("kundli_details", []), theme_palette=theme_palette))
        story.append(Spacer(1, 8))

    # Favourable (premium)
    fav = report_data.get("favourable", {}).get("numerology", {})
    fav_title = _get_text("Favourable Insights", "अनुकूल सुझाव", is_bilingual, is_hindi_only, is_english_only)
    _maybe(story, [
        Paragraph(f'<bookmark name="favourable" />{fav_title}', styles["Section"]),
        _key_value_table(
            [
                [_get_text("Destiny Number", "भाग्यांक", is_bilingual, is_hindi_only, is_english_only), str(fav.get("destiny_number") or "-")],
                [_get_text("Name Number", "नामांक", is_bilingual, is_hindi_only, is_english_only), str(fav.get("name_number") or "-")],
                [_get_text("Radical Number", "मूलांक", is_bilingual, is_hindi_only, is_english_only), str(fav.get("radical_number") or "-")],
                [_get_text("Friendly Numbers", "अनुकूल संख्याएँ", is_bilingual, is_hindi_only, is_english_only), ", ".join(str(n) for n in fav.get("friendly_numbers", [])) or "-"],
                [_get_text("Evil Number", "प्रतिकूल संख्या", is_bilingual, is_hindi_only, is_english_only), str(fav.get("evil_number") or "-")],
                [_get_text("Neutral Numbers", "तटस्थ संख्याएँ", is_bilingual, is_hindi_only, is_english_only), ", ".join(str(n) for n in fav.get("neutral_numbers", [])) or "-"],
                [_get_text("Lucky Day", "शुभ दिन", is_bilingual, is_hindi_only, is_english_only), ", ".join(fav.get("lucky_day", [])) or "-"],
                [_get_text("Lucky Mantra", "शुभ मंत्र", is_bilingual, is_hindi_only, is_english_only), fav.get("lucky_mantra", "-")],
                [_get_text("Lucky Stone", "शुभ रत्न", is_bilingual, is_hindi_only, is_english_only), fav.get("lucky_stone", "-")],
                [_get_text("Lucky Color", "शुभ रंग", is_bilingual, is_hindi_only, is_english_only), ", ".join(fav.get("lucky_color", [])) or "-"],
            ],
            col_widths=[150, 270],
            theme_palette=theme_palette,
        ),
        Spacer(1, 8)
    ], sec_key="auspicious_factors")

    # Predictions (premium)
    pred_title = _get_text("Kundli Predictions", "भविष्यवाणियाँ", is_bilingual, is_hindi_only, is_english_only)
    _maybe(story, [
        Paragraph(f'<bookmark name="predictions" />{pred_title}', styles["Section"]),
        *_predictions_block(report_data.get("predictions", {}), is_bilingual=is_bilingual, is_english_only=is_english_only),
        Spacer(1, 8)
    ], sec_key="chart_analysis")

    # --- MASTER ENGINE RESULTS ---
    master = report_data.get("master_engine", {})
    if master and should_render("yogas"):
        master_title = _get_text("Master Vedic Analysis", "मास्टर वैदिक विश्लेषण", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="master_analysis" />{master_title}', styles["Section"]))
        
        # Major Yogas
        yogas = master.get("yogas", [])
        if yogas:
            yoga_title = _get_text("Major Yogas Identified", "प्रमुख योग", is_bilingual, is_hindi_only, is_english_only)
            story.append(Paragraph(yoga_title, styles["SubSection"]))
            for y in yogas:
                y_name = y.get("name", "Unknown Yoga")
                story.append(Paragraph(f"• {y_name}", styles["BodyText"]))
            story.append(Spacer(1, 10))
            
        # Profession Indications
        prof = master.get("profession", "")
        if prof:
            prof_title = _get_text("Profession & Career Indications", "व्यवसाय और करियर संकेत", is_bilingual, is_hindi_only, is_english_only)
            story.append(Paragraph(prof_title, styles["SubSection"]))
            story.append(Paragraph(prof, styles["BodyText"]))
            story.append(Spacer(1, 12))
        
        story.append(Spacer(1, 10))


    # Planet positions
    if should_render("planet_positions"):
        planet_title = _get_text("Position of Planets", "ग्रह स्थिति", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="planet_positions" />{planet_title}', styles["Section"]))
        story.append(_planet_table(report_data.get("planet_positions", []), theme_palette=theme_palette))
        story.append(Spacer(1, 8))

    # Shadbala / Strengths
    if should_render("strengths"):
        strength_data = report_data.get("strength", {}).get("planets", {})
        if strength_data:
            shadbala_title = _get_text("Shadbala (Planetary Strengths)", "षड्बल (ग्रहीय बल)", is_bilingual, is_hindi_only, is_english_only)
            story.append(Paragraph(f'<bookmark name="strengths" />{shadbala_title}', styles["Section"]))
            
            headers = [_get_text("Planet", "ग्रह", is_bilingual, is_hindi_only, is_english_only),
                       _get_text("Total Strength", "कुल बल", is_bilingual, is_hindi_only, is_english_only),
                       _get_text("Status", "स्थिति", is_bilingual, is_hindi_only, is_english_only)]
            table_data = [headers]
            
            for p, p_data in strength_data.items():
                total = p_data.get("total", 0)
                # Assign simple text status based on total score (typical Shadbala ~100 is average)
                status = "Strong" if total >= 120 else ("Average" if total >= 90 else "Weak")
                table_data.append([p, f"{total:.2f}", status])
                
            tbl = Table(table_data, colWidths=[140, 140, 140])
            header_color = theme_palette["table_header"] if theme_palette else colors.lightgrey
            text_color = theme_palette["text"] if theme_palette else colors.black
            tbl.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, 0), header_color),
                        ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                        ("TOPPADDING", (0, 0), (-1, -1), 6),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
                        ("TEXTCOLOR", (0, 0), (-1, -1), text_color),
                    ]
                )
            )
            story.append(tbl)
            story.append(Spacer(1, 8))

    # Note: Lagna Chart is rendered as an image (same as Rashi Chart) and will be added below

    # Note: Lagna Chart is rendered as an image (same as Rashi Chart) and will be added below
    # with the other chart images


    def _safe_add_image(story, image_path, section_title, svg_path=None, width=6 * inch, height=6 * inch):
        # Try SVG FIRST for pristine, unrasterized vector charts matching report fonts
        if svg_path and os.path.exists(svg_path) and os.path.getsize(svg_path) > 100:
            try:
                # Try using svglib to render SVG directly
                try:
                    from svglib.svglib import svg2rlg
                    from reportlab.graphics import renderPDF
                    
                    drawing = svg2rlg(svg_path)
                    if drawing:
                        # Calculate scale to fit within width/height (preserve aspect ratio)
                        if drawing.width > 0 and drawing.height > 0:
                            orig_width = drawing.width
                            orig_height = drawing.height
                            
                            scale_x = width / orig_width
                            scale_y = height / orig_height
                            scale = min(scale_x, scale_y)  # Preserve aspect ratio
                            
                            # Scale the drawing
                            drawing.scale(scale, scale)
                            drawing.width = orig_width * scale
                            drawing.height = orig_height * scale
                            
                            print(f"[CHART EMBED] SVG scaled: original {orig_width:.0f}x{orig_height:.0f} -> {drawing.width:.1f}x{drawing.height:.1f}")
                        else:
                            drawing.width = width
                            drawing.height = height
                            print(f"[CHART EMBED] SVG using default size: {width:.1f}x{height:.1f}")
                        
                        story.append(Paragraph(section_title, styles["Section"]))
                        story.append(drawing)
                        story.append(Spacer(1, 8))
                        print(f"[CHART EMBED] Successfully added vector SVG via svglib: {svg_path}")
                        return True
                except ImportError:
                    print("[CHART EMBED] svglib not available")
                except Exception as e:
                    print(f"[CHART EMBED] Failed to render SVG with svglib {svg_path}: {e}")
            except Exception as e:
                print(f"[CHART EMBED] SVG rendering failed for {svg_path}: {e}")

        # Fallback: Try PNG if SVG is not available or failed
        if image_path and os.path.exists(image_path) and os.path.getsize(image_path) > 100:
            try:
                # Fully load and validate the PNG file
                from PIL import Image as PILImage
                img = PILImage.open(image_path)
                img.verify()
                img = PILImage.open(image_path)
                img.load()
                img.close()
                
                try:
                    story.append(Paragraph(section_title, styles["Section"]))
                    story.append(Image(image_path, width=width, height=height))
                    story.append(Spacer(1, 8))
                    print(f"[CHART EMBED] Successfully added raster PNG fallback: {image_path}")
                    return True
                except Exception as e:
                    print(f"[CHART EMBED] Failed to create ReportLab Image for PNG {image_path}: {e}")
            except Exception as e:
                print(f"[CHART EMBED] PNG validation failed for {image_path}: {e}")
        
        return False

    # Chart images (rendered earlier) - skip if invalid to prevent PDF generation errors
    chart_images = report_data.get("chart_images", {})

    # --- Charts Section ---
    # The user wants D1, D2, D3, D4, D7, D9, D10, D12, D16, D20, D24, D27, D30, D40, D45, D60
    # Each on a separate page.
    
    # 1. Page Break before charts begin
    story.append(PageBreak())
    
    # 2. Lagna Chart (First)
    lagna_png = chart_images.get("lagna_png") or chart_images.get("rasi_png")
    lagna_svg = (
        os.path.join("reports/images", "lagna_chart.svg")
        if os.path.exists(os.path.join("reports/images", "lagna_chart.svg"))
        else os.path.join("reports/images", "rasi_chart.svg")
    )
    lagna_title = _get_text("Lagna Chart", "लग्न चार्ट", is_bilingual, is_hindi_only, is_english_only)
    if should_render("d1_chart") and _safe_add_image(story, lagna_png, f'<bookmark name="lagna" />{lagna_title}', svg_path=lagna_svg, width=7.5 * inch, height=5 * inch):
        print("[CHART EMBED] Added Lagna Chart")
        
        # Add legend hint below chart
        hint_text = _get_text("Note: * = Vakri (Retrograde), # = Asth (Combust)", 
                             "नोट: * = वक्री (Retrograde), # = अस्त (Combust)",
                             is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f"<i>{hint_text}</i>", styles["BodyText"]))
        story.append(Spacer(1, 10))
        
        # ── AI explanation text (if available) for D1 ───────────────────────
        d1_explanation = report_data.get("ai_text", {}).get("varga_explanations", {}).get("d1", {})
        if d1_explanation:
            en_text = d1_explanation.get("en", "")
            hi_text = d1_explanation.get("hi", "")
            if en_text or hi_text:
                story.append(Spacer(1, 12))
                expl_heading = _get_text("Detailed Chart Analysis", "विस्तृत चार्ट विश्लेषण", is_bilingual, is_hindi_only, is_english_only)
                story.append(Paragraph(f"<b>{expl_heading}</b>", styles["SubSection"]))
                story.append(Spacer(1, 10))
                text_content = _get_text(en_text, hi_text, is_bilingual, is_hindi_only, is_english_only)
                story.append(Paragraph(text_content, styles["BodyText"]))
                story.append(Spacer(1, 15))
                story.append(Paragraph(f"<b>Esoteric Significance:</b> This chart represents your physical body, identity, and general path in life.", styles["BodyText"]))

        
        # Add Planetary Effects in Houses — rich structured format
        planet_positions = report_data.get("planet_positions", [])
        if planet_positions:
            _render_planet_effects_block(
                story, planet_positions, theme_palette,
                chart_label="Lagna", varga_num=1, ascendant_sign=""
            )

        story.append(PageBreak())

    # 3. Dynamic Vargas Loop (D1, D2, D3, ..., D60)
    varga_list = [1, 2, 3, 4, 7, 9, 10, 12, 30, 60]
    varga_names = {
        1: ("Rasi Chart (D1)", "राशि चार्ट (D1)"),
        2: ("Hora Chart (D2)", "होरा चार्ट (D2)"),
        3: ("Drekkana Chart (D3)", "द्रेष्काण चार्ट (D3)"),
        4: ("Chaturthamsha Chart (D4)", "चतुर्थांश चार्ट (D4)"),
        7: ("Saptamsha Chart (D7)", "सप्तांश चार्ट (D7)"),
        9: ("Navamsha Chart (D9)", "नवांश चार्ट (D9)"),
        10: ("Dashamsha Chart (D10)", "दशांश चार्ट (D10)"),
        12: ("Dvadashamsha Chart (D12)", "द्वादशांश चार्ट (D12)"),
        16: ("Shodashamsha Chart (D16)", "षोडशांश चार्ट (D16)"),
        20: ("Vishamsha Chart (D20)", "विंशांश चार्ट (D20)"),
        24: ("Chaturvimshamsha Chart (D24)", "चतुर्विंशांश चार्ट (D24)"),
        27: ("Saptavimshamsha Chart (D27)", "सप्तविंशांश चार्ट (D27)"),
        30: ("Trimshamsha Chart (D30)", "त्रिंशांश चार्ट (D30)"),
        40: ("Khavedamsha Chart (D40)", "खवेदांश चार्ट (D40)"),
        45: ("Akshavedamsha Chart (D45)", "अक्षवेदांश चार्ट (D45)"),
        60: ("Shashtiamsha Chart (D60)", "षष्ट्यांश चार्ट (D60)"),
    }

    # Get varga explanations from AI text
    varga_explanations = report_data.get("ai_text", {}).get("varga_explanations", {})
    
    for d in varga_list:
        v_key = f"d{d}"
        if v_key == "d1" and not should_render("d1_chart"):
            continue
        if v_key != "d1" and not should_render(v_key):
            continue
        png_path = chart_images.get(f"{v_key}_png")
        svg_path = chart_images.get(f"{v_key}_svg") or os.path.join("reports/images", f"{v_key}_chart.svg")
        
        en_name, hi_name = varga_names.get(d, (f"D{d} Chart", f"D{d} चार्ट"))
        title = _get_text(en_name, hi_name, is_bilingual, is_hindi_only, is_english_only)
        
        if _safe_add_image(story, png_path, f'<bookmark name="{v_key}" />{title}', svg_path=svg_path, width=7.5 * inch, height=5 * inch):
            print(f"[CHART EMBED] Added {v_key} chart")
            
            # Add legend hint below chart
            hint_text = _get_text("Note: * = Vakri (Retrograde), # = Asth (Combust)", 
                                 "नोट: * = वक्री (Retrograde), # = अस्त (Combust)",
                                 is_bilingual, is_hindi_only, is_english_only)
            story.append(Paragraph(f"<i>{hint_text}</i>", styles["BodyText"]))
            story.append(Spacer(1, 10))

            # ── AI explanation text (if available) ───────────────────────
            explanation = varga_explanations.get(v_key, {})
            if explanation:
                en_text = explanation.get("en", "")
                hi_text = explanation.get("hi", "")
                if en_text or hi_text:
                    story.append(Spacer(1, 12))
                    expl_heading = _get_text("Detailed Chart Analysis", "विस्तृत चार्ट विश्लेषण", is_bilingual, is_hindi_only, is_english_only)
                    story.append(Paragraph(f"<b>{expl_heading}</b>", styles["SubSection"]))
                    story.append(Spacer(1, 10))
                    text_content = _get_text(en_text, hi_text, is_bilingual, is_hindi_only, is_english_only)
                    story.append(Paragraph(text_content, styles["BodyText"]))
                    significance_map = {
                        1: "This chart represents your physical body, identity, and general path in life.",
                        2: "This chart analyzes your wealth, family values, and speech.",
                        3: "This chart focuses on your siblings, courage, and creative talents.",
                        4: "This chart reveals your destiny regarding property, vehicles, and inner happiness.",
                        7: "This chart is dedicated to children, legacy, and creative fruits.",
                        9: "The most important divisional chart, representing the fruit of your actions and marital life.",
                        10: "This chart analyzes your career, professional status, and societal impact.",
                        12: "This chart focuses on your parents and your relationship with your ancestry.",
                        16: "This chart provides deep insights into your mental happiness and luxury.",
                        20: "This chart is used for analyzing spiritual growth and religious inclinations.",
                        24: "This chart is focused on higher learning, scholarship, and wisdom.",
                        27: "This chart represents your inherent strengths and soul's resilience.",
                        30: "This chart reveals the sub-conscious flaws and the strength of character.",
                        40: "This chart provides a fine-grained analysis of auspicious results in life.",
                        45: "This chart focuses on the moral and ethical conduct belonging to your soul.",
                        60: "The most subtle chart, showing the results of karma across multiple lifetimes."
                    }
                    if d in significance_map:
                        story.append(Spacer(1, 15))
                        story.append(Paragraph(f"<b>Esoteric Significance:</b> {significance_map[d]}", styles["BodyText"]))

            # ── Planetary Effects for this divisional chart ───────────────
            story.append(Spacer(1, 12))
            v_chart_model = None
            if d == 1:
                v_chart_model = report_data.get("chart")
            elif d == 9:
                v_chart_model = report_data.get("vargas", {}).get(v_key) or report_data.get("d9")
            else:
                v_chart_model = report_data.get("vargas", {}).get(v_key)

            if v_chart_model:
                varga_planets, asc_sign = _extract_planets_from_chart(v_chart_model)
            else:
                varga_planets = report_data.get("planet_positions", [])
                asc_sign = ""
            _render_planet_effects_block(
                story, varga_planets, theme_palette,
                chart_label=f"D{d}", varga_num=d, ascendant_sign=asc_sign
            )

            story.append(Spacer(1, 20))
            story.append(Paragraph("<hr width='60%' color='#dddddd'/>", styles["BodyText"]))
            story.append(PageBreak())

    # 4. Ashtakavarga
    av_png = chart_images.get("ashtakavarga_png")
    av_svg = chart_images.get("ashtakavarga_svg") or os.path.join("reports/images", "ashtakavarga.svg")
    av_title = _get_text("Sarvashtakavarga", "सर्वाष्टकवर्ग", is_bilingual, is_hindi_only, is_english_only)
    if av_png or os.path.exists(av_svg):
        added_av_chart = _safe_add_image(story, av_png, f'<bookmark name="ashtakavarga" />{av_title}', svg_path=av_svg)
        if added_av_chart:
            print("[CHART EMBED] Added Ashtakavarga")

            # ── Overview paragraph ───────────────────────────────────────
            story.append(Paragraph(
                "<b>How to Read this Chart:</b> Each number in the Ashtakavarga wheel is the total "
                "bindu (point) score for that house/sign, contributed by all 8 planets + Lagna. "
                "Higher bindus indicate stronger planetary support in that life domain. "
                "<b>Reference Scale:</b> 0–20 = Very Weak &bull; 21–25 = Weak &bull; "
                "26–28 = Average &bull; 29–33 = Strong &bull; 34+ = Very Strong. "
                "The sum of all 12 house scores always equals 337 bindus.",
                styles["BodyText"]
            ))
            story.append(Spacer(1, 14))

            # ── Per-house score analysis ──────────────────────────────────
            av_data = report_data.get("ashtakavarga") or report_data.get("strength", {}).get("ashtakavarga")
            sarva_scores: List[Any] = []
            if av_data and isinstance(av_data, dict):
                sarva_scores = av_data.get("sarvashtakavarga", [])
            # If not found in report_data, try to compute on the fly
            if not sarva_scores and _HAS_CHARTS and compute_ashtakavarga_classical is not None:
                try:
                    jd_ut_av  = report_data.get("jd_ut") or report_data.get("basic_details", {}).get("jd_ut")
                    lat_av    = report_data.get("basic_details", {}).get("lat")
                    lon_av    = report_data.get("basic_details", {}).get("lon")
                    if jd_ut_av and lat_av is not None and lon_av is not None:
                        av_result = compute_ashtakavarga_classical(jd_ut_av, lat_av, lon_av)
                        sarva_scores = av_result.get("sarvashtakavarga", [])
                        print(f"[SAV] Computed on-the-fly: {sarva_scores}")
                except Exception as e:
                    print(f"[SAV] Could not compute SAV scores: {e}")

            if sarva_scores and len(sarva_scores) >= 12:
                story.append(Paragraph(
                    "<b>House-by-House Score Analysis</b>",
                    styles["SubSection"]
                ))
                story.append(Spacer(1, 8))

                ordinals = {
                    1:"1st",2:"2nd",3:"3rd",4:"4th",5:"5th",6:"6th",
                    7:"7th",8:"8th",9:"9th",10:"10th",11:"11th",12:"12th"
                }
                for h_idx in range(12):
                    h_num   = h_idx + 1
                    try:
                        score_val = sarva_scores[h_idx]
                        score     = int(score_val)
                    except (ValueError, TypeError, IndexError):
                        score     = 28  # fallback to average if data is missing

                    interp  = get_sav_interpretation(h_num, score)
                    ordinal = ordinals[h_num]
                    band    = interp["band_label"]
                    bcolor  = interp["band_color"]
                    area    = interp["area"]
                    sig     = interp["significator"]

                    # House heading row
                    h_title = f"<b>House {h_num} ({ordinal}) — {area}</b>"
                    h_scoring = f"| Score: <font color='{bcolor}'><b>{score} Bindus ({band})</b></font>"
                    h_sig = f"| Significator: {sig}"
                    
                    story.append(Paragraph(f"{h_title} {h_scoring} {h_sig}", styles["SubSection"]))
                    story.append(Spacer(1, 4))

                    # Band description
                    story.append(Paragraph(interp["band_desc"], styles["BodyText"]))
                    story.append(Spacer(1, 8))

                    # ── Implications Table ──
                    impl_data = [
                        [Paragraph("<b>Domain Category</b>", styles["BodyText"]),
                         Paragraph("<b>Key Implication / Assessment</b>", styles["BodyText"])]
                    ]
                    for cat, impl_text in interp["implications"].items():
                        impl_data.append([
                            Paragraph(f"<b>{cat}</b>", styles["BodyText"]),
                            Paragraph(impl_text, styles["BodyText"]),
                        ])

                    itbl = Table(impl_data, colWidths=[130, 340])
                    itbl.setStyle(TableStyle([
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("BACKGROUND", (0, 0), (-1, 0), theme_palette.get("header_bg", colors.lightgrey)),
                        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                        ("BOX", (0, 0), (-1, -1), 1, theme_palette.get("primary", colors.navy)),
                    ]))
                    story.append(itbl)
                    story.append(Spacer(1, 8))

                    # ── Contextual Details ──
                    ctx_row_data = [
                        [Paragraph("<b>Remedies</b>", styles["BodyText"]),
                         Paragraph(interp["remedies"], styles["BodyText"])],
                        [Paragraph("<b>Perspective</b>", styles["BodyText"]),
                         Paragraph(interp["better_perspective"], styles["BodyText"])]
                    ]
                    ctbl = Table(ctx_row_data, colWidths=[100, 370])
                    ctbl.setStyle(TableStyle([
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("BACKGROUND", (0, 0), (-1, -1), colors.whitesmoke),
                        ("TOPPADDING", (0, 0), (-1, -1), 6),
                  ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                  ("INNERGRID", (0, 0), (-1, -1), 0.3, colors.lightgrey),
                        ("BOX", (0, 0), (-1, -1), 0.5, colors.grey),
                    ]))
                    story.append(ctbl)
                    story.append(Spacer(1, 15))

                    if h_num % 3 == 0 and h_num < 12:
                        story.append(PageBreak())

                    # Contextual Factors table
                    ctx_rows = [
                        [Paragraph("<b>Average Score</b>", styles["BodyText"]),
                         Paragraph(interp["avg_note"], styles["BodyText"])],
                        [Paragraph("<b>Remedies</b>", styles["BodyText"]),
                         Paragraph(interp["remedies"], styles["BodyText"])],
                        [Paragraph("<b>Better Perspective</b>", styles["BodyText"]),
                         Paragraph(interp["better_perspective"], styles["BodyText"])],
                    ]
                    story.append(Paragraph("<b>Contextual Factors:</b>", styles["BodyText"]))
                    ctx_tbl = Table(ctx_rows, colWidths=[120, 350])
                    ctx_tbl.setStyle(TableStyle([
                        ("VALIGN",          (0, 0), (-1, -1), "TOP"),
                        ("ROWBACKGROUNDS",  (0, 0), (-1, -1),
                         [colors.HexColor("#fff8f0"), colors.HexColor("#fdefd8")]),
                        ("BOX",            (0, 0), (-1, -1), 0.4, colors.HexColor("#c97e3a")),
                        ("TOPPADDING", (0, 0), (-1, -1), 6),
                  ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                  ("INNERGRID",      (0, 0), (-1, -1), 0.25, colors.HexColor("#e8c49a")),
                        ("LEFTPADDING",    (0, 0), (-1, -1), 5),
                        ("RIGHTPADDING",   (0, 0), (-1, -1), 5),
                        ("TOPPADDING",     (0, 0), (-1, -1), 3),
                        ("BOTTOMPADDING",  (0, 0), (-1, -1), 3),
                    ]))
                    story.append(ctx_tbl)
                    story.append(Spacer(1, 18))

                    # Page break every 3 houses for readability
                    if h_num % 3 == 0 and h_num < 12:
                        story.append(PageBreak())

            story.append(PageBreak())

    # Destiny Graph (Career)
    destiny_svg = report_data.get("chart_images", {}).get("destiny_career")
    if destiny_svg and os.path.exists(destiny_svg):
        from svglib.svglib import svg2rlg
        from reportlab.graphics import renderPDF

        destiny_title = _get_text("Destiny Career Timeline (2025-2035)", "भाग्य करियर समयरेखा (2025-2035)", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="destiny_grid" />{destiny_title}', styles["Section"]))
        
        drawing = svg2rlg(destiny_svg)
        if drawing:
            # Scale to page width
            drawing.width = 540
            drawing.height = 250
            story.append(drawing)
            story.append(Spacer(1, 12))
            story.append(PageBreak())

    # Transit Events Table (Layer 22)
    transits = report_data.get("transit_events", [])
    if transits:
        transit_title = _get_text("Transit Event Alerts", "गोचर घटना अलर्ट", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="transits" />{transit_title}', styles["Section"]))
        
        # Header for the table
        rows = [[
            _get_text("Type", "प्रकार", is_bilingual, is_hindi_only, is_english_only),
            _get_text("Category", "श्रेणी", is_bilingual, is_hindi_only, is_english_only),
            _get_text("Summary", "सारांश", is_bilingual, is_hindi_only, is_english_only)
        ]]
        
        for e in transits:
            rows.append([
                e["event"].replace("_", " ").title(),
                e["category"].title(),
                e["summary"]
            ])
            
        story.append(Table(
            rows, 
            colWidths=[120, 100, 320],
            style=TableStyle([
                ('GRID', (0, 0), (-1, -1), 0.25, colors.grey),
                ('BACKGROUND', (0, 0), (-1, 0), theme_palette["table_header"]),
                ('TEXTCOLOR', (0, 0), (-1, -1), theme_palette["text"]),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
            ])
        ))
        story.append(Spacer(1, 12))
        story.append(PageBreak())

    # Destiny Timeline Table (Layer 23)
    timeline = report_data.get("destiny_timeline", [])
    if timeline:
        timeline_title = _get_text("Destiny Timeline (2025-2035)", "भाग्य समयरेखा (2025-2035)", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="destiny_timeline" />{timeline_title}', styles["Section"]))
        
        # Header for the table
        rows = [[
            _get_text("Year", "वर्ष", is_bilingual, is_hindi_only, is_english_only),
            _get_text("Score", "स्कोर", is_bilingual, is_hindi_only, is_english_only),
            _get_text("Phase", "चरण", is_bilingual, is_hindi_only, is_english_only),
            _get_text("Summary", "सारांश", is_bilingual, is_hindi_only, is_english_only)
        ]]
        
        for y in timeline:
            rows.append([
                str(y["year"]),
                str(y["score"]),
                y["phase"],
                y["summary"]
            ])
            
        story.append(Table(
            rows, 
            colWidths=[60, 60, 80, 340],
            style=TableStyle([
                ('GRID', (0, 0), (-1, -1), 0.25, colors.grey),
                ('BACKGROUND', (0, 0), (-1, 0), theme_palette["table_header"]),
                ('TEXTCOLOR', (0, 0), (-1, -1), theme_palette["text"]),
                ('ALIGN', (0, 0), (2, -1), 'CENTER'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
            ])
        ))
        story.append(Spacer(1, 12))
        
        # --- ADD GRAPH INTO REPORT ---
        timeline_data = report_data.get("destiny_timeline", [])
        if timeline_data:
            story.append(Spacer(1, 12))
            story.append(Paragraph("Destiny Graph (2025–2035)", styles["Section"]))
            story.append(DestinyGraphFlowable(timeline_data))
            story.append(Spacer(1, 12))
            
        # --- COSMIC LIFE MAP ---
        _add_life_map_page(story, report_data, styles)
        
        # --- DESTINY MATRIX ---
        _add_destiny_matrix_page(story, report_data, styles)
            
        story.append(PageBreak())

    # --- Wealth Prediction Section ---
    _render_wealth_prediction(story, report_data, styles, theme_palette, is_bilingual, is_english_only)

    # Life Events Table (Layer 21)
    events = report_data.get("life_events", [])
    if events:
        events_title = _get_text("Life Event Predictions (2025-2035)", "जीवन घटना भविष्यवाणियां (2025-2035)", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="life_events" />{events_title}', styles["Section"]))
        
        # Header for the table
        rows = [[
            _get_text("Year", "वर्ष", is_bilingual, is_hindi_only, is_english_only),
            _get_text("Category", "श्रेणी", is_bilingual, is_hindi_only, is_english_only),
            _get_text("Event", "घटना", is_bilingual, is_hindi_only, is_english_only),
            _get_text("Intensity", "तीव्रता", is_bilingual, is_hindi_only, is_english_only)
        ]]
        
        if events and "events" in events[0] and isinstance(events[0]["events"], list):
            # NEW FORMAT: List of year objects with "events" list
            for item in events:
                year = item["year"]
                scores = item.get("score", {})
                
                for evt_name in item.get("events", []):
                    # Infer category and intensity
                    category = "General"
                    intensity = 0
                    
                    if "Marriage" in evt_name:
                        category = "Relationship"
                        intensity = scores.get("marriage", 0)
                    elif "Career" in evt_name:
                        category = "Career"
                        intensity = scores.get("career", 0)
                    elif "Wealth" in evt_name:
                        category = "Finance"
                        intensity = scores.get("wealth", 0)
                    elif "Health" in evt_name:
                        category = "Health"
                        intensity = scores.get("health", 0)
                        
                    rows.append([
                        str(year),
                        category,
                        evt_name,
                        f"{intensity}"
                    ])
        else:
            # OLD FORMAT: List of event objects
            for e in events[:25]:
                rows.append([
                    str(e.get("year", "")),
                    e.get("category", "General").title(),
                    e.get("title", ""),
                    f"{e.get('intensity', 0):.1f}"
                ])
            
        story.append(Table(
            rows, 
            colWidths=[60, 100, 200, 60],
            style=TableStyle([
                ('GRID', (0, 0), (-1, -1), 0.25, colors.grey),
                ('BACKGROUND', (0, 0), (-1, 0), theme_palette["table_header"]),
                ('TEXTCOLOR', (0, 0), (-1, -1), theme_palette["text"]),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ])
        ))
        story.append(Spacer(1, 12))
        story.append(PageBreak())

    # Dosha
    if should_render("dosha"):
        dosha_title = _get_text("Dosha Summary", "दोष सारांश", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="dosha" />{dosha_title}', styles["Section"]))
        story.append(_dosha_table(report_data.get("dosha", {}), theme_palette=theme_palette))
        story.append(Spacer(1, 12))
    
    # Detailed Sade Sati Analysis
    _render_sadesati_section(story, report_data, styles, theme_palette, is_bilingual, is_hindi_only, is_english_only)

    # Detailed Dosha Analysis from AI Text
    ai_text = report_data.get("ai_text", {})
    if ai_text:
        # Map dosha keys to their AI text keys
        dosha_keys = [
            ("kalsarpa_dosha", "Kalsarpa Dosha Analysis", "कालसर्प दोष विश्लेषण"),
            ("manglik_dosha", "Manglik Dosha Analysis", "मांगलिक दोष विश्लेषण"),
            ("pitra_dosha", "Pitra Dosha Analysis", "पितृ दोष विश्लेषण"),
            ("sadesati_analysis", "Sade Sati Analysis", "साढ़े साती विश्लेषण"),
        ]
        
        for d_key, en_head, hi_head in dosha_keys:
            text_content = ai_text.get(d_key)
            if text_content:
                head = _get_text(en_head, hi_head, is_bilingual, is_hindi_only, is_english_only)
                story.append(Paragraph(f"<b>{head}</b>", styles["SubSection"]))
                
                # Use _get_text to handle language correctly if it's a dict
                if isinstance(text_content, dict):
                    body = _get_text(text_content.get("en", ""), text_content.get("hi", ""), is_bilingual, is_hindi_only, is_english_only)
                else:
                    body = str(text_content)
                
                story.append(Paragraph(body, styles["BodyText"]))
                story.append(Spacer(1, 8))

    story.append(Spacer(1, 8))

    # --- Sentient Soul Archetype & Destiny Section ---
    sentient = report_data.get("sentient", {})
    if sentient and sentient.get("sentient_story"):
        sentient_title = _get_text("Soul Archetype & Destiny", "आत्मा का स्वरूप और भाग्य", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="sentient" />{sentient_title}', styles["Section"]))
        story.append(Paragraph(sentient.get("sentient_story", ""), styles["BodyText"]))
        story.append(Spacer(1, 10))

    # --- Akashic Soul Record Section ---
    akashic = report_data.get("akashic", {})
    if akashic and akashic.get("akashic_story"):
        akashic_title = _get_text("Akashic Soul Record", "आत्मिक यात्रा", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="akashic" />{akashic_title}', styles["Section"]))
        story.append(Paragraph(akashic.get("akashic_story", ""), styles["BodyText"]))
        story.append(Spacer(1, 10))

    # --- Omniscient Analysis Section ---
    omniscient = report_data.get("omniscient", {})
    if omniscient:
        omni_title = _get_text("Omniscient Analysis", "परम ज्योतिष दृष्टि", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="omniscient" />{omni_title}', styles["Section"]))
        
        omni_archetype = omniscient.get('personality', {}).get('archetype', '')
        if omni_archetype:
            story.append(Paragraph(f"<b>Archetype:</b> {omni_archetype}", styles["BodyText"]))
        
        omni_conf = omniscient.get('confidence_score', '')
        if omni_conf:
            story.append(Paragraph(f"<b>Confidence Score:</b> {omni_conf}", styles["BodyText"]))
            
        omni_emotion = omniscient.get("emotion_model", "")
        if omni_emotion:
            story.append(Paragraph(str(omni_emotion), styles["BodyText"]))
            
        story.append(Spacer(1, 12))

    # --- Quantum Forecast Analysis Section ---
    quantum = report_data.get("quantum", {})
    if quantum and quantum.get("narrative"):
        quantum_title = _get_text("Quantum Forecast Analysis", "क्वांटम भविष्य दृष्टि", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="quantum" />{quantum_title}', styles["Section"]))
        story.append(Paragraph(quantum.get("narrative", ""), styles["BodyText"]))
        story.append(Spacer(1, 12))

    # --- Dimensional Destiny Analysis Section ---
    dim = report_data.get("dimensional", {})
    if dim and dim.get("narrative"):
        dim_title = _get_text("Dimensional Destiny Analysis", "बहुआयामी भाग्य विश्लेषण", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="dimensional" />{dim_title}', styles["Section"]))
        story.append(Paragraph(dim.get("narrative", ""), styles["BodyText"]))
        story.append(Spacer(1, 12))

    # --- Astral Matrix Destiny Analysis Section ---
    astral = report_data.get("astral_matrix", {})
    if astral and astral.get("astral_narrative"):
        astral_title = _get_text("Astral Matrix Destiny Analysis", "सूक्ष्म भाग्य विश्लेषण", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="astral_matrix" />{astral_title}', styles["Section"]))
        story.append(Paragraph(astral.get("astral_narrative", ""), styles["BodyText"]))
        story.append(Spacer(1, 12))

    # --- Cosmic Destiny Analysis Section ---
    cosmic_core = report_data.get("cosmic_core", {})
    if cosmic_core and cosmic_core.get("cosmic_narrative"):
        cosmic_title = _get_text("Cosmic Destiny Analysis", "ब्रह्मांडीय भाग्य विश्लेषण", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="cosmic_core" />{cosmic_title}', styles["Section"]))
        story.append(Paragraph(cosmic_core.get("cosmic_narrative", ""), styles["BodyText"]))
        story.append(Spacer(1, 12))

        story.append(Spacer(1, 12))

    # --- Maharishi Destiny Analysis Section ---
    maharishi = report_data.get("maharishi", {})
    if maharishi and maharishi.get("maharishi_text"):
        maharishi_title = _get_text("Maharishi Destiny Analysis", "महर्षि विश्लेषण", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="maharishi" />{maharishi_title}', styles["Section"]))
        story.append(Paragraph(maharishi.get("maharishi_text", ""), styles["BodyText"]))
        story.append(Spacer(1, 12))

        story.append(Spacer(1, 12))

    # --- Brahma Destiny Analysis Section ---
    brahma = report_data.get("brahma", {})
    if brahma and brahma.get("brahma_text"):
        brahma_title = _get_text("Brahma Destiny Analysis", "ब्रह्मा विश्लेषण", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="brahma" />{brahma_title}', styles["Section"]))
        story.append(Paragraph(brahma.get("brahma_text", ""), styles["BodyText"]))
        story.append(Spacer(1, 12))

        story.append(Spacer(1, 12))

    # --- Paramarshi Advisor Analysis Section ---
    paramarshi = report_data.get("paramarshi", {})
    if paramarshi and paramarshi.get("answer"):
        para_title = _get_text("Paramarshi Advisor Analysis", "परमर्षि सलाह", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="paramarshi" />{para_title}', styles["Section"]))
        story.append(Paragraph(paramarshi.get("answer", ""), styles["BodyText"]))
        story.append(Spacer(1, 12))

    # --- Planetary Wisdom Section (Phase 2) ---
    _render_planetary_wisdom(story, report_data, styles, theme_palette, is_bilingual, is_hindi_only, is_english_only)

    # --- Oracle (Sage Insights) Section ---
    oracle_insights = report_data.get("oracle_insights", [])
    if oracle_insights:
        oracle_title = _get_text("Sage Insights & Divine Oracle", "ऋषि वाणी और दैवीय परामर्श", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="oracle" />{oracle_title}', styles["Section"]))
        story.append(Spacer(1, 12))
        
        for i, item in enumerate(oracle_insights):
            q = item.get("question", "")
            a = item.get("answer", "")
            
            if q and a:
                story.append(Paragraph(f"<b>Q: {q}</b>", styles["SubSection"]))
                story.append(Spacer(1, 10))
                story.append(Paragraph(a, styles["BodyText"]))
                
                # Consolidate: 4-5 questions per page
                if (i + 1) % 4 == 0:
                    story.append(Spacer(1, 20))
                    story.append(Paragraph("<i>The path to mastery is paved with the wisdom of the ancients.</i>", styles["BodyText"]))
                    story.append(PageBreak())
                else:
                    story.append(Spacer(1, 20))
            
        story.append(PageBreak())

    # --- Karma & Destiny Sections (Phase 2) ---
    _render_detailed_karma_timeline(story, report_data, styles, theme_palette, is_bilingual, is_hindi_only, is_english_only)
    _render_life_events_narrative(story, report_data, styles, theme_palette, is_bilingual, is_hindi_only, is_english_only)
    _add_probability_matrix(story, report_data, styles)
    _add_destiny_graph(story, report_data, styles)

    # Neural Summary (New Section)
    if "neural" in report_data and "summary" in report_data["neural"]:
        story.append(Spacer(1, 20))
        story.append(Paragraph("Cosmic Neural Summary", styles["Section"]))
        story.append(Spacer(1, 10))
        story.append(Paragraph(report_data["neural"]["summary"], styles["BodyText"]))
        story.append(Spacer(1, 20))

    # Destiny Signature (New Section)
    destiny = report_data.get("destiny", {})
    if destiny:
        story.append(Paragraph("Destiny Signature", styles["Section"]))
        story.append(Spacer(1, 10))
        story.append(Paragraph(f"Destiny Type: {destiny.get('type','-')}", styles["BodyText"]))
        story.append(Paragraph(f"Destiny Power Score: {destiny.get('power','-')}/100", styles["BodyText"]))
        for e in destiny.get("events", []):
            story.append(Paragraph(f"• {e['message']}", styles["BodyText"]))
        story.append(Spacer(1, 20))

    # AI Life Vector Analysis (New Section)
    pred = report_data.get("life_vector_predictions", {})
    if pred:
        story.append(Paragraph("AI Life Vector Analysis", styles["Section"]))
        for key, text in pred.items():
            formatted_key = key.replace("_", " ").title()
            story.append(Paragraph(f"<b>{formatted_key}</b>", styles["SubSection"]))
            story.append(Paragraph(text, styles["BodyText"]))
            story.append(Spacer(1, 6))
        story.append(Spacer(1, 20))

    # Dasha
    dash = report_data.get("dasha", {})
    if dash.get("current"):
        current = dash["current"]
        dasha_title = _get_text("Current Vimshottari Dasha", "वर्तमान दशा", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="current_dasha" />{dasha_title}', styles["Section"]))
        story.append(
            _key_value_table(
                [
                    [_get_text("Mahadasha Lord", "महादशा", is_bilingual, is_hindi_only, is_english_only) + ":", current.get("lord", "")],
                    [_get_text("Start Date", "आरंभ", is_bilingual, is_hindi_only, is_english_only) + ":", current.get("start_date", current.get("start_jd", ""))],
                    [_get_text("End Date", "समापन", is_bilingual, is_hindi_only, is_english_only) + ":", current.get("end_date", current.get("end_jd", ""))],
                    [_get_text("Duration (years)", "अवधि", is_bilingual, is_hindi_only, is_english_only) + ":", f"{current.get('duration_years', 0.0):.2f}"],
                ],
                theme_palette=theme_palette,
            )
        )
        story.append(Spacer(1, 6))

    timeline_title = _get_text("Vimshottari Timeline", "दशा टाइमलाइन", is_bilingual, is_hindi_only, is_english_only)
    if should_render("dasha_timeline"):
        story.append(Paragraph(f'<bookmark name="dasha_timeline" />{timeline_title}', styles["SubSection"]))
    dasha_rows = [[_get_text("Lord", "दशा", is_bilingual, is_hindi_only, is_english_only), 
                   _get_text("Start Date", "आरंभ", is_bilingual, is_hindi_only, is_english_only), 
                   _get_text("End Date", "समापन", is_bilingual, is_hindi_only, is_english_only), 
                   _get_text("Duration", "अवधि", is_bilingual, is_hindi_only, is_english_only)]]
    for row in dash.get("list", [])[:20]:
        dasha_rows.append(
            [
                row.get("lord", ""),
                row.get("start_date", row.get("start_jd", "")),
                row.get("end_date", row.get("end_jd", "")),
                f"{row.get('duration_years', 0.0):.2f} yrs",
            ]
        )
    story.append(
        Table(
            dasha_rows,
            repeatRows=1,
            colWidths=[80, 120, 120, 80],
            style=TableStyle(
                [
                    ("GRID", (0, 0), (-1, -1), 0.25, colors.grey),
                    ("BACKGROUND", (0, 0), (-1, 0), theme_palette["table_header"]),
                    ("TEXTCOLOR", (0, 0), (-1, -1), theme_palette["text"]),
                ]
            ),
        )
    )
    story.append(PageBreak())

    # --- Remedies Section ---
    remedies = report_data.get("remedies", [])
    if remedies and should_render("remedies"):
        rem_title = _get_text("Remedial Measures", "उपाय", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="remedies" />{rem_title}', styles["Section"]))
        
        for remedy in remedies:
            # Color code based on severity/type
            # remedy struct: {'type': 'Gemstone', 'description': '...', 'conviction': 'High'}
            r_type = remedy.get("type", "General")
            r_desc = remedy.get("description", "")
            
            story.append(Paragraph(f"<b>{r_type}</b>", styles["SubSection"]))
            story.append(Paragraph(r_desc, styles["BodyText"]))
            story.append(Spacer(1, 6))
        
        story.append(PageBreak())

    # --- Recommended Gemstones Section ---
    if "gemstones" in report_data and report_data["gemstones"]:
        story.append(Paragraph("Recommended Gemstones", styles["Section"]))
        for gem in report_data["gemstones"]:
            g = gem["details"]
            text = f"""
Planet: {gem['planet']}<br/>
Gemstone: {g['gemstone']} ({g['sanskrit']})<br/>
Color: {g['color']}<br/>
Metal: {g['metal']}<br/>
Finger: {g['finger']}<br/>
Day: {g['day']}<br/>
Mantra: {g['mantra']}<br/>
Reason: {gem['reason']}
          """
            story.append(Paragraph(text, styles["Body"]))
        story.append(Spacer(1, 10))
        story.append(PageBreak())

    # --- AI Life Analysis Section ---
    ai_analysis = report_data.get("ai_life_analysis", {})
    if ai_analysis:
        ai_title = _get_text("Detailed Life Analysis", "विस्तृत जीवन विश्लेषण", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="ai_analysis" />{ai_title}', styles["Section"]))
        
        # Order of sections
        sections = [
            ("character_personality", "Personality & Character", "व्यक्तित्व और चरित्र"),
            ("happiness", "Happiness & Fulfillment", "सुख और संतोष"),
            ("life_purpose", "Life Purpose", "जीवन उद्देश्य"),
            ("career", "Career & Profession", "करियर और व्यवसाय"),
            ("finance", "Wealth & Finance", "धन और वित्त"),
            ("health", "Health & Vitality", "स्वास्थ्य और जीवन शक्ति"),
            ("relationships", "Relationships & Marriage", "संबंध और विवाह"),
            ("education", "Education & Knowledge", "शिक्षा और ज्ञान"),
            ("hobbies", "Creativity & Hobbies", "रचनात्मकता और शौक"),
            ("lifestyle", "Lifestyle & Routine", "जीवनशैली और दिनचर्या"),
            ("spirituality", "Spirituality & Soul Journey", "आध्यात्मिकता और आत्मिक यात्रा"),
            ("hidden_potential", "Latent Potential & Occult", "गुप्त क्षमता और रहस्यवाद"),
            ("travel", "Travel & Global Connections", "यात्रा और वैश्विक संबंध"),
            ("siblings_and_courage", "Siblings, Peers & Valour", "भाई-बहन, मित्र और पराक्रम"),
            ("parental_heritage", "Ancestral Heritage & Blessings", "पैतृक विरासत और आशीर्वाद"),
        ]

        for key, en_head, hi_head in sections:
            content = ai_analysis.get(key)
            if content:
                head = _get_text(en_head, hi_head, is_bilingual, is_hindi_only, is_english_only)
                story.append(Paragraph(f"<b>{head}</b>", styles["SubSection"]))
                story.append(Paragraph(str(content), styles["BodyText"]))
                story.append(Spacer(1, 10))
                
        story.append(PageBreak())

    # --- Glossary (Phase 2) ---
    _render_vedic_glossary(story, styles, theme_palette, is_bilingual, is_hindi_only, is_english_only)

    # --- Remedies Deep Dive (New for depth) ---
    _render_remedy_deep_dive(story, styles, theme_palette, is_bilingual, is_hindi_only, is_english_only)

    # --- Advanced Predictive Logic ---
    _render_advanced_predictive_logic(story, styles, theme_palette, is_bilingual, is_hindi_only, is_english_only)

    # --- Life Cycle Overview ---
    _render_life_cycle_overview(story, styles, theme_palette, is_bilingual, is_hindi_only, is_english_only)

    # ---------------------------------------------------------
    # 26. Cosmic Graphs
    # ---------------------------------------------------------
    graphs = report_data.get("graph_images", {})
    if graphs:
        story.append(PageBreak())
        story.append(Paragraph(_get_text("Cosmic Life Trends", "ब्रह्मांडीय जीवन रुझान", is_bilingual, is_hindi_only, is_english_only), styles['Heading1']))
        story.append(Spacer(1, 12))

        for key, path in graphs.items():
            if os.path.exists(path):
                # Clean up key name for title (e.g., "destiny_curve" -> "Destiny Curve")
                title = key.replace("_", " ").title()
                story.append(Paragraph(title, styles["Heading2"]))
                story.append(Spacer(1, 6))
                
                # Add Image
                try:
                    img = Image(path, width=450, height=225)
                    story.append(img)
                except Exception as e:
                    story.append(Paragraph(f"Could not load graph: {e}", styles["BodyText"]))
                
                story.append(Spacer(1, 12))

    # ---------------------------------------------------------
    # 27. Cosmic AI Interpretations
    # ---------------------------------------------------------
    ai_sections = report_data.get("ai_interpretation", {})
    if ai_sections:
        story.append(PageBreak())
        story.append(Paragraph(_get_text("Cosmic AI Interpretations", "ब्रह्मांडीय एआई व्याख्या", is_bilingual, is_hindi_only, is_english_only), styles['Heading1']))
        story.append(Spacer(1, 12))

        for key, text in ai_sections.items():
            title = key.replace("_", " ").title()
            story.append(Paragraph(title, styles["Heading2"]))
            story.append(Paragraph(text, styles["BodyText"]))
            story.append(Spacer(1, 6))

    # ---------------------------------------------------------
    # 28. Ultra NLP Narratives
    # ---------------------------------------------------------
    nlp = report_data.get("ultra_nlp_text", {})
    if nlp:
        story.append(PageBreak())
        story.append(Paragraph(_get_text("Cosmic Narratives", "ब्रह्मांडीय कथाएं", is_bilingual, is_hindi_only, is_english_only), styles['Heading1']))
        story.append(Spacer(1, 12))

        for title, content in nlp.items():
            if content:
                # Format title (e.g. career_finance -> Career Finance)
                display_title = title.replace("_", " ").title()
                story.append(Paragraph(display_title, styles["Heading2"]))
                story.append(Paragraph(content, styles["BodyText"]))
                story.append(Spacer(1, 12))

    # Build PDF with decorations (watermark, footer, page numbers)
    def _on_page(canvas_obj, doc_obj):
        _decorate_page(canvas_obj, doc_obj, theme_palette)

    # Hook afterFlowable so TableOfContents can collect headings
    def _after_flowable(flowable):
        from reportlab.platypus import Paragraph as RLParagraph
        if not isinstance(flowable, RLParagraph):
            return
        style_name = getattr(flowable.style, "name", "")
        if style_name not in ("Section", "SubSection"):
            return
        # Level 0 for Section, 1 for SubSection
        level = 0 if style_name == "Section" else 1
        text = flowable.getPlainText()
        toc.addEntry(level, text, doc.page)

    doc.afterFlowable = _after_flowable

    # Use multiBuild for TOC: two passes so page numbers are correct
    doc.multiBuild(story, onFirstPage=_on_page, onLaterPages=_on_page)


# ------------------------
# Top-level helper that assembles data, renders charts, and builds PDF
# ------------------------
def generate_report_from_birth(
    date_str: str,
    time_str: str,
    tz_offset: float,
    lat: float,
    lon: float,
    style: str = DEFAULT_REPORT_STYLE,
    language: str = "english",  # "english" | "hindi" | "bilingual"
    output_path: str = "kundali_report.pdf",
    name: str = "",
    gender: str = "",
    location_name: str = "",
    theme: str = DEFAULT_THEME,
    user_password: Optional[str] = None,
    owner_password: Optional[str] = None,
    user_profile: Optional[Dict] = None,
    active_sections: Optional[list] = None,
) -> Dict[str, Any]:
    """
    Top-level generator:
      - calls assemble_report_data
      - renders charts images (if possible)
      - builds the final PDF with render_detailed_pdf
    """
    # 1) assemble report data
    report_data = assemble_report_data(
        name=name,
        date=date_str,
        time=time_str,
        tz_offset=tz_offset,
        lat=lat,
        lon=lon,
        gender=gender,
        location_name=location_name,
    )

    # attach chosen style and language
    report_data["style"] = style or DEFAULT_REPORT_STYLE
    report_data["language"] = language or "english"
    report_data["active_sections"] = active_sections

    # 2) render charts (if available)
    try:
        images = _render_charts_from_report_data(report_data, out_dir="reports/images")
        if images:
            report_data["chart_images"] = images
    except Exception:
        traceback.print_exc()

    # Engine calls (Karma, Destiny, Life Events, etc.) are now handled
    # inside assemble_report_data for consistency.
    
    # 2.4) Cosmic Trainer - Global Pattern Learning (Layer 18)
    report_data = run_cosmic_trainer(report_data)

    # 2.7) Final Learning Feedback Loop
    learn_from_report(report_data)

    # 3) build PDF
    try:
        render_detailed_pdf(report_data, output_path, theme_name=theme, language=language,
                             user_password=user_password, owner_password=owner_password)
    except Exception:
        traceback.print_exc()
        raise

    return report_data

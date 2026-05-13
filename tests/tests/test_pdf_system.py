"""
Full PDF System Diagnostic Test
--------------------------------
This script verifies all components required for your
Vedic Astrology report generator:

1. Cairo working
2. CairoSVG SVG→PNG conversion
3. Chart renderers generate SVG + PNG
4. SVGLIB can embed SVG into PDF
5. Final PDF builds successfully
"""

import os
import sys

# FIX: add project root (vedic-astrology-app)
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.append(ROOT)

import traceback
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4

# ---- Test 1: CairoSVG ----
def test_cairo():
    print("\n[TEST] CairoSVG Conversion")
    try:
        import cairosvg
        cairosvg.svg2png(
            bytestring=b'<svg height="100" width="100"><rect width="100" height="100" style="fill:blue"/></svg>',
            write_to="diagnostic_blue.png"
        )
        print(" ✔ CairoSVG: OK (SVG→PNG succeeded)")
    except Exception as e:
        print(" ✖ CairoSVG FAILED:", e)
        raise


# ---- Test 2: Chart Renderer (SVG + PNG) ----
def test_chart_render():
    print("\n[TEST] Chart Rendering (SVG + PNG)")
    try:
        os.makedirs("reports/images", exist_ok=True)

        from charts.renderers.north_indian_rasi_renderer import render_north_indian_chart

        # minimal fake chart
        chart = {
            "houses": {
                i: {"sign_name": "Aries", "planets": ["Sun"] if i == 1 else []}
                for i in range(1, 13)
            },
            "meta": {"name": "Diagnostic Chart"}
        }

        svg_path = "reports/images/diag_rasi.svg"
        png_path = "reports/images/diag_rasi.png"

        render_north_indian_chart(chart, svg_path, size=600, to_png=png_path)

        print(" ✔ SVG created?", os.path.exists(svg_path))
        print(" ✔ PNG created?", os.path.exists(png_path))

        if not os.path.exists(svg_path):
            raise RuntimeError("SVG not generated")
        if not os.path.exists(png_path):
            raise RuntimeError("PNG not generated")

    except Exception as e:
        print(" ✖ Chart Renderer FAILED:", e)
        traceback.print_exc()
        raise


# ---- Test 3: SVGLIB Embedding Test ----
def test_svglib():
    print("\n[TEST] Embedding SVG into PDF (svglib + reportlab)")

    try:
        from svglib.svglib import svg2rlg
        from reportlab.platypus import SimpleDocTemplate

        svg_path = "reports/images/diag_rasi.svg"
        pdf_path = "diagnostic_svg_embed.pdf"

        drawing = svg2rlg(svg_path)
        doc = SimpleDocTemplate(pdf_path)

        from reportlab.platypus import Flowable

        class DrawWrapper(Flowable):
            def __init__(self, drawing):
                super().__init__()
                self.d = drawing
                self.width = drawing.width
                self.height = drawing.height

            def draw(self):
                renderPDF = __import__('reportlab.graphics.renderPDF').graphics.renderPDF
                renderPDF.draw(self.d, self.canv, 0, 0)

        story = [DrawWrapper(drawing)]
        doc.build(story)

        print(" ✔ PDF with embedded SVG created?", os.path.exists(pdf_path))

    except Exception as e:
        print(" ✖ SVGLIB FAILED:", e)
        traceback.print_exc()
        raise


# ---- Test 4: Full Report PDF ----
def test_full_pdf():
    print("\n[TEST] Full PDF Generation")

    try:
        from reports.pdf_generator import generate_report_from_birth

        output_file = "diagnostic_full_report.pdf"

        generate_report_from_birth(
            date_str="02-04-1987",
            time_str="13:40",
            tz_offset=5.5,
            lat=25.76,
            lon=84.15,
            name="Diagnostic Test",
            gender="M",
            location_name="Ballia, India",
            output_path=output_file
        )

        print(" ✔ Full PDF created?", os.path.exists(output_file))

    except Exception as e:
        print(" ✖ Full PDF FAILED:", e)
        traceback.print_exc()
        raise


# ---- MAIN RUNNER ----
if __name__ == "__main__":
    print("====== PDF SYSTEM DIAGNOSTICS ======\n")
    test_cairo()
    test_chart_render()
    test_svglib()
    test_full_pdf()
    print("\n====== ALL TESTS COMPLETED ======\n")

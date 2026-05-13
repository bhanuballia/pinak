import os
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4

def test_hindi_pdf():
    font_path = "reports/fonts/NotoSansDevanagari-Regular.ttf"
    print(f"Checking for font at: {os.path.abspath(font_path)}")
    if not os.path.exists(font_path):
        print("Font NOT found!")
        return

    try:
        pdfmetrics.registerFont(TTFont("NotoSansDev", font_path))
        print("Font registered successfully")
    except Exception as e:
        print(f"Font registration failed: {e}")
        return

    doc = SimpleDocTemplate("test_hindi.pdf", pagesize=A4)
    styles = getSampleStyleSheet()
    styles["Normal"].fontName = "NotoSansDev"
    
    story = []
    # Test English and Hindi
    story.append(Paragraph("Test: This is English", styles["Normal"]))
    story.append(Spacer(1, 12))
    story.append(Paragraph("नमस्ते, यह एक परीक्षण है (Hindi Test)", styles["Normal"]))
    
    doc.build(story)
    print("PDF build successful: test_hindi.pdf")

if __name__ == "__main__":
    test_hindi_pdf()

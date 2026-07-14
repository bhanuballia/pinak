from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

def test_root_font():
    root_font_path = r"D:\vedic-astrology-app\NotoSansDevanagari-Regular.ttf"
    
    print(f"Checking {root_font_path}...")
    if os.path.exists(root_font_path):
        print(f"File size: {os.path.getsize(root_font_path)} bytes")
        try:
            pdfmetrics.registerFont(TTFont("NotoDevaRoot", root_font_path))
            print("Successfully registered Noto Sans Devanagari from root")
        except Exception as e:
            print(f"Failed to register Noto Sans from root: {e}")
    else:
        print("Root font file missing")

if __name__ == "__main__":
    test_root_font()

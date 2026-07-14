from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

def test_fonts():
    font_dir = r"D:\vedic-astrology-app\reports\fonts"
    sans_path = os.path.join(font_dir, "NotoSansDevanagari-Regular.ttf")
    serif_path = os.path.join(font_dir, "NotoSerifDevanagari-Regular.ttf")
    
    print(f"Checking {sans_path}...")
    if os.path.exists(sans_path):
        print(f"File size: {os.path.getsize(sans_path)} bytes")
        try:
            pdfmetrics.registerFont(TTFont("NotoDeva", sans_path))
            print("Successfully registered Noto Sans Devanagari")
        except Exception as e:
            print(f"Failed to register Noto Sans: {e}")
    else:
        print("Noto Sans file missing")
        
    print(f"\nChecking {serif_path}...")
    if os.path.exists(serif_path):
        print(f"File size: {os.path.getsize(serif_path)} bytes")
        try:
            pdfmetrics.registerFont(TTFont("NotoDevaBold", serif_path))
            print("Successfully registered Noto Serif Devanagari")
        except Exception as e:
            print(f"Failed to register Noto Serif: {e}")
    else:
        print("Noto Serif file missing")

if __name__ == "__main__":
    test_fonts()

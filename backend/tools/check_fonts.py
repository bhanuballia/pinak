from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

font_dir = "reports/fonts"
fonts = [
    "NotoSansDevanagari-Regular.ttf",
    "NotoSerifDevanagari-Regular.ttf"
]

for f in fonts:
    path = os.path.abspath(os.path.join(font_dir, f))
    print(f"Checking {path}...")
    if not os.path.exists(path):
        print(f"  FILE MISSING")
        continue
    
    size = os.path.getsize(path)
    print(f"  Size: {size} bytes")
    
    with open(path, 'rb') as f_bin:
        header = f_bin.read(4)
        print(f"  Header hex: {header.hex()}")
    
    try:
        pdfmetrics.registerFont(TTFont(f"Test_{f}", path))
        print(f"  SUCCESSFULLY REGISTERED")
    except Exception as e:
        print(f"  REGISTRATION FAILED: {e}")

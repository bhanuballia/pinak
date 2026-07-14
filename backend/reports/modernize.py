import re

with open('pdf_generator.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update THEMES
old_gold = """    "gold": {
        "background": colors.white,
        "text": colors.HexColor("#4e342e"),
        "header": colors.HexColor("#b8860b"),
        "accent": colors.HexColor("#daa520"),
        "watermark": colors.HexColor("#f4e7c1"),
        "table_header": colors.HexColor("#fff8dc"),
    },"""

new_gold = """    "gold": {
        "background": colors.white,
        "text": colors.HexColor("#334155"), 
        "header": colors.HexColor("#4f46e5"), 
        "accent": colors.HexColor("#6366f1"), 
        "watermark": colors.HexColor("#f8fafc"), 
        "table_header": colors.HexColor("#f1f5f9"), 
    },"""
content = content.replace(old_gold, new_gold)

# 2. Modernize _get_styles
# Let's find def _get_styles and modify the Heading and Section styles
old_h1 = """        ParagraphStyle(
            name="Heading1",
            parent=styles["Heading1"],
            fontName=BOLD_FONT,
            fontSize=24,
            leading=28,
            spaceAfter=20,
            textColor=theme_palette["header"],
            alignment=1,
        )
    )"""
new_h1 = """        ParagraphStyle(
            name="Heading1",
            parent=styles["Heading1"],
            fontName=BOLD_FONT,
            fontSize=26,
            leading=32,
            spaceAfter=24,
            textColor=theme_palette["header"],
            alignment=1,
        )
    )"""
content = content.replace(old_h1, new_h1)

old_section = """        ParagraphStyle(
            name="Section",
            parent=styles["Heading2"],
            fontName=BOLD_FONT,
            fontSize=16,
            leading=20,
            spaceBefore=15,
            spaceAfter=10,
            textColor=theme_palette["accent"],
            borderPadding=5,
        )
    )"""
new_section = """        ParagraphStyle(
            name="Section",
            parent=styles["Heading2"],
            fontName=BOLD_FONT,
            fontSize=18,
            leading=22,
            spaceBefore=20,
            spaceAfter=12,
            textColor=theme_palette["accent"],
            borderPadding=5,
            borderWidth=0,
            borderColor=colors.HexColor("#e2e8f0"),
        )
    )"""
content = content.replace(old_section, new_section)

# 3. Add padding to tables and soften grids
# We will replace `("BOX", (0, 0), (-1, -1), 0.25, colors.grey)`
content = re.sub(r'\("BOX",\s*\(0,\s*0\),\s*\(-1,\s*-1\),\s*0\.25,\s*colors\.grey\)',
                 '("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1"))', content)

content = re.sub(r'\("INNERGRID",\s*\(0,\s*0\),\s*\(-1,\s*-1\),\s*0\.25,\s*colors\.grey\)',
                 '("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0"))', content)

# Inject TOPPADDING and BOTTOMPADDING into all TableStyle constructors
# by replacing `("INNERGRID"` with padding + INNERGRID
padding_str = """("TOPPADDING", (0, 0), (-1, -1), 6),
                  ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                  ("INNERGRID\""""

content = content.replace('("INNERGRID"', padding_str)

with open('pdf_generator.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Modernized PDF styles!")

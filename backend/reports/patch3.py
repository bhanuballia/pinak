import re

with open('pdf_generator.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. D1 Chart (Lagna Chart image generation)
old_lagna = """    lagna_title = _get_text("Lagna Chart", "लग्न चार्ट", is_bilingual, is_hindi_only, is_english_only)
    if _safe_add_image(story, lagna_png, f'<bookmark name="lagna" />{lagna_title}', svg_path=lagna_svg, width=7.5 * inch, height=5 * inch):"""
new_lagna = """    lagna_title = _get_text("Lagna Chart", "लग्न चार्ट", is_bilingual, is_hindi_only, is_english_only)
    if should_render("d1_chart") and _safe_add_image(story, lagna_png, f'<bookmark name="lagna" />{lagna_title}', svg_path=lagna_svg, width=7.5 * inch, height=5 * inch):"""
content = content.replace(old_lagna, new_lagna)

# 2. Dasha Timeline
old_dasha_tl = """    timeline_title = _get_text("Vimshottari Timeline", "दशा टाइमलाइन", is_bilingual, is_hindi_only, is_english_only)
    story.append(Paragraph(f'<bookmark name="dasha_timeline" />{timeline_title}', styles["SubSection"]))"""
new_dasha_tl = """    timeline_title = _get_text("Vimshottari Timeline", "दशा टाइमलाइन", is_bilingual, is_hindi_only, is_english_only)
    if should_render("dasha_timeline"):
        story.append(Paragraph(f'<bookmark name="dasha_timeline" />{timeline_title}', styles["SubSection"]))"""
content = content.replace(old_dasha_tl, new_dasha_tl)

# Also wrap the actual loop of dasha timeline rows
# the old code goes right into appending table...
# Let's use regex for dasha timeline table
old_dasha_table = """    dasha_rows = [[_get_text("Lord", "दशा", is_bilingual, is_hindi_only, is_english_only), 
                   _get_text("Start Date", "प्रारंभ तिथि", is_bilingual, is_hindi_only, is_english_only), 
                   _get_text("End Date", "अंतिम तिथि", is_bilingual, is_hindi_only, is_english_only), 
                   _get_text("Duration", "अवधि", is_bilingual, is_hindi_only, is_english_only)]]
    for d in dash["list"][:6]:
        duration = round(d["end_jd"] - d["start_jd"]) // 365
        dasha_rows.append([d["planet"], d["start_date"], d["end_date"], f"{duration} yrs"])
    story.append(
        Table(
            dasha_rows,
            repeatRows=1,
            colWidths=[80, 120, 120, 80],
            style=TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), theme_palette["primary"]),
                    ("TEXTCOLOR", (0, 0), (-1, 0), theme_palette["text_on_primary"]),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
                    ("BACKGROUND", (0, 1), (-1, -1), theme_palette["background"]),
                    ("TEXTCOLOR", (0, 1), (-1, -1), theme_palette["text"]),
                    ("GRID", (0, 0), (-1, -1), 0.5, theme_palette["primary"]),
                ]
            ),
        )
    )
    story.append(PageBreak())"""

new_dasha_table = """    if should_render("dasha_timeline"):
        dasha_rows = [[_get_text("Lord", "दशा", is_bilingual, is_hindi_only, is_english_only), 
                       _get_text("Start Date", "प्रारंभ तिथि", is_bilingual, is_hindi_only, is_english_only), 
                       _get_text("End Date", "अंतिम तिथि", is_bilingual, is_hindi_only, is_english_only), 
                       _get_text("Duration", "अवधि", is_bilingual, is_hindi_only, is_english_only)]]
        for d in dash["list"][:6]:
            duration = round(d["end_jd"] - d["start_jd"]) // 365
            dasha_rows.append([d["planet"], d["start_date"], d["end_date"], f"{duration} yrs"])
        story.append(
            Table(
                dasha_rows,
                repeatRows=1,
                colWidths=[80, 120, 120, 80],
                style=TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, 0), theme_palette["primary"]),
                        ("TEXTCOLOR", (0, 0), (-1, 0), theme_palette["text_on_primary"]),
                        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                        ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
                        ("BACKGROUND", (0, 1), (-1, -1), theme_palette["background"]),
                        ("TEXTCOLOR", (0, 1), (-1, -1), theme_palette["text"]),
                        ("GRID", (0, 0), (-1, -1), 0.5, theme_palette["primary"]),
                    ]
                ),
            )
        )
        story.append(PageBreak())"""
content = content.replace(old_dasha_table, new_dasha_table)


with open('pdf_generator.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch 3 applied successfully!")

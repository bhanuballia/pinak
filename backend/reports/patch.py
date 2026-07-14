import re

with open('pdf_generator.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Dosha section
old_dosha = """    # Dosha
    dosha_title = _get_text("Dosha Summary", "दोष सारांश", is_bilingual, is_hindi_only, is_english_only)
    story.append(Paragraph(f'<bookmark name="dosha" />{dosha_title}', styles["Section"]))
    story.append(_dosha_table(report_data.get("dosha", {}), theme_palette=theme_palette))
    story.append(Spacer(1, 12))"""
new_dosha = """    # Dosha
    if should_render("dosha"):
        dosha_title = _get_text("Dosha Summary", "दोष सारांश", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="dosha" />{dosha_title}', styles["Section"]))
        story.append(_dosha_table(report_data.get("dosha", {}), theme_palette=theme_palette))
        story.append(Spacer(1, 12))"""
content = content.replace(old_dosha, new_dosha)

with open('pdf_generator.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Dosha patched!")

import re

with open('pdf_generator.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Predictions (chart_analysis)
old_pred = """    # Predictions (premium)
    pred_title = _get_text("Kundli Predictions", "भविष्यवाणियाँ", is_bilingual, is_hindi_only, is_english_only)
    _maybe(story, [
        Paragraph(f'<bookmark name="predictions" />{pred_title}', styles["Section"]),
        *_predictions_block(report_data.get("predictions", {}), is_bilingual=is_bilingual, is_english_only=is_english_only),
        Spacer(1, 8)
    ])"""
new_pred = """    # Predictions (premium)
    pred_title = _get_text("Kundli Predictions", "भविष्यवाणियाँ", is_bilingual, is_hindi_only, is_english_only)
    _maybe(story, [
        Paragraph(f'<bookmark name="predictions" />{pred_title}', styles["Section"]),
        *_predictions_block(report_data.get("predictions", {}), is_bilingual=is_bilingual, is_english_only=is_english_only),
        Spacer(1, 8)
    ], sec_key="chart_analysis")"""
content = content.replace(old_pred, new_pred)

# 2. D1 Chart toggle (d1_chart)
# Around line 2231 there is: if v_key != "d1" and not should_render(v_key):
old_vkey = """        if v_key != "d1" and not should_render(v_key):
            continue"""
new_vkey = """        if v_key == "d1" and not should_render("d1_chart"):
            continue
        if v_key != "d1" and not should_render(v_key):
            continue"""
content = content.replace(old_vkey, new_vkey)

# 3. Add Shadbala section
# I'll inject it right after Planet Positions (which ends around line 2090)
old_planet_pos = """    # Planet positions
    if should_render("planet_positions"):
        planet_title = _get_text("Position of Planets", "ग्रह स्थिति", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="planet_positions" />{planet_title}', styles["Section"]))
        story.append(_planet_table(report_data.get("planet_positions", []), theme_palette=theme_palette))
        story.append(Spacer(1, 8))"""

new_planet_pos = old_planet_pos + """

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
                
            story.append(_list_table(table_data, theme_palette=theme_palette))
            story.append(Spacer(1, 8))
"""
content = content.replace(old_planet_pos, new_planet_pos)

# 4. Current Dasha -> dasha
old_current_dasha = """    if dasha:
        dasha_title = _get_text("Current Vimshottari Dasha", "वर्तमान विंशोत्तरी दशा", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="current_dasha" />{dasha_title}', styles["Section"]))"""
new_current_dasha = """    if dasha and should_render("dasha"):
        dasha_title = _get_text("Current Vimshottari Dasha", "वर्तमान विंशोत्तरी दशा", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="current_dasha" />{dasha_title}', styles["Section"]))"""
content = content.replace(old_current_dasha, new_current_dasha)


with open('pdf_generator.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied successfully!")

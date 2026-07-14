import re

with open('pdf_generator.py', 'r', encoding='utf-8') as f:
    content = f.read()

def wrap_section(content, section_marker, check_key):
    # This is a bit tricky, but let's do a simple regex for known AI sections
    # e.g., Sentient Soul, Akashic Records, etc.
    # Each section starts with something like:
    # sentient_title = _get_text("Sentient Soul Archetype", ...)
    # _maybe(story, [ ... ]) is what we should ideally use, but since there are many story.append
    # let's just wrap the if condition around it.
    pass

# Let's replace them explicitly

replacements = [
    # Sentient
    (
        """    sentient = report_data.get("sentient", {})
    if sentient:
        sentient_title = _get_text("Sentient Soul Archetype", "संवेदनशील आत्मा मूलरूप", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="sentient" />{sentient_title}', styles["Section"]))
        story.append(Paragraph(sentient.get("sentient_story", ""), styles["BodyText"]))
        story.append(Spacer(1, 10))""",
        """    sentient = report_data.get("sentient", {})
    if sentient and should_render("soul_archetype"):
        sentient_title = _get_text("Sentient Soul Archetype", "संवेदनशील आत्मा मूलरूप", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="sentient" />{sentient_title}', styles["Section"]))
        story.append(Paragraph(sentient.get("sentient_story", ""), styles["BodyText"]))
        story.append(Spacer(1, 10))"""
    ),
    # Akashic
    (
        """    akashic = report_data.get("akashic", {})
    if akashic:
        akashic_title = _get_text("Akashic Records", "आकाशिक रिकॉर्ड्स", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="akashic" />{akashic_title}', styles["Section"]))
        story.append(Paragraph(akashic.get("akashic_story", ""), styles["BodyText"]))
        story.append(Spacer(1, 10))""",
        """    akashic = report_data.get("akashic", {})
    if akashic and should_render("akashic"):
        akashic_title = _get_text("Akashic Records", "आकाशिक रिकॉर्ड्स", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="akashic" />{akashic_title}', styles["Section"]))
        story.append(Paragraph(akashic.get("akashic_story", ""), styles["BodyText"]))
        story.append(Spacer(1, 10))"""
    ),
    # Quantum
    (
        """    quantum = report_data.get("quantum", {})
    if quantum:
        quantum_title = _get_text("Quantum Reality", "क्वांटम वास्तविकता", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="quantum" />{quantum_title}', styles["Section"]))
        story.append(Paragraph(quantum.get("narrative", ""), styles["BodyText"]))
        story.append(Spacer(1, 12))""",
        """    quantum = report_data.get("quantum", {})
    if quantum and should_render("quantum"):
        quantum_title = _get_text("Quantum Reality", "क्वांटम वास्तविकता", is_bilingual, is_hindi_only, is_english_only)
        story.append(Paragraph(f'<bookmark name="quantum" />{quantum_title}', styles["Section"]))
        story.append(Paragraph(quantum.get("narrative", ""), styles["BodyText"]))
        story.append(Spacer(1, 12))"""
    ),
    # Dasha timeline
    (
        """    timeline_title = _get_text("Cosmic Dasha Timeline", "दशा टाइमलाइन", is_bilingual, is_hindi_only, is_english_only)
    story.append(Paragraph(f'<bookmark name="dasha_timeline" />{timeline_title}', styles["SubSection"]))""",
        """    timeline_title = _get_text("Cosmic Dasha Timeline", "दशा टाइमलाइन", is_bilingual, is_hindi_only, is_english_only)
    if should_render("dasha_timeline"):
        story.append(Paragraph(f'<bookmark name="dasha_timeline" />{timeline_title}', styles["SubSection"]))"""
    )
]

for old_str, new_str in replacements:
    content = content.replace(old_str, new_str)

with open('pdf_generator.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("AI Sections patched!")

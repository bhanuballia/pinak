from core.ai_engine.interpretation_builder import (
    build_career_text,
    build_relationship_text,
    build_health_text
)

from core.ai_engine.tone_formatter import format_paragraph


def run_cosmic_ai_engine(report_data):

    strength = report_data.get("strength_analysis", {})
    dosha = report_data.get("dosha_analysis", {})
    timeline = report_data.get("omniscient_timeline", {}).get("omniscient_timeline", [])

    sections = {}

    # Career
    career_text = build_career_text(strength, timeline)
    sections["career_finance"] = format_paragraph(
        "Career & Finance Predictions",
        career_text
    )

    # Relationships
    rel_text = build_relationship_text(strength, timeline)
    sections["love_relationship"] = format_paragraph(
        "Love & Relationships",
        rel_text
    )

    # Health
    health_text = build_health_text(dosha)
    sections["health_wellness"] = format_paragraph(
        "Health & Wellness",
        health_text
    )

    return sections

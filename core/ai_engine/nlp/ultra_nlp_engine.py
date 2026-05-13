from core.ai_engine.nlp.narrative_builder import (
    build_career_narrative,
    build_relationship_narrative,
)

def run_ultra_nlp_engine(report_data):

    strength = report_data.get("strength_analysis", {})
    timeline = report_data.get("omniscient_timeline", {}).get("omniscient_timeline", [])

    sections = {}

    sections["career_finance"] = build_career_narrative(
        strength,
        timeline
    )

    sections["love_relationship"] = build_relationship_narrative(
        strength
    )

    return sections

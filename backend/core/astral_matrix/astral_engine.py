from .marriage_matrix import marriage_matrix
from .career_matrix import career_matrix
from .karma_cycles import detect_karma_cycles
from .event_heatmap import build_event_heatmap
from .astral_narrative_ai import astral_narrative


def run_astral_matrix_engine(chart, dasha, dosha, strength, dimensional):

    marriage = marriage_matrix(chart, dasha, strength)

    career = career_matrix(chart, strength)

    karma = detect_karma_cycles(chart, dasha)

    heatmap = build_event_heatmap(marriage, career, karma)

    narrative = astral_narrative(
        marriage,
        career,
        karma,
        dimensional
    )

    return {
        "marriage_matrix": marriage,
        "career_matrix": career,
        "karma_cycles": karma,
        "event_heatmap": heatmap,
        "astral_narrative": narrative
    }

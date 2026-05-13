from .soul_purpose import calculate_soul_purpose
from .karma_patterns import detect_karma_patterns
from .life_path_ai import build_life_path
from .vedic_writer import generate_cosmic_narrative


def run_cosmic_core(chart, strength, dosha, astral, quantum):

    soul = calculate_soul_purpose(chart, strength)

    karma = detect_karma_patterns(chart, dosha)

    life_path = build_life_path(soul, astral, quantum)

    narrative = generate_cosmic_narrative(
        soul,
        karma,
        life_path
    )

    return {
        "soul_purpose": soul,
        "karma_patterns": karma,
        "life_path": life_path,
        "cosmic_narrative": narrative
    }

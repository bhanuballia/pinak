from .yoga_library import detect_classical_yogas
from .career_profiler import detect_career_path
from .marriage_analyzer import analyze_marriage
from .fortune_index import compute_fortune_index
from .maharishi_writer import build_maharishi_text


def run_maharishi_engine(chart, strength, dosha, dasha, omniscient):

    yogas = detect_classical_yogas(chart)

    career = detect_career_path(chart, strength)

    marriage = analyze_marriage(chart, dosha, dasha)

    fortune = compute_fortune_index(
        strength,
        yogas,
        dosha
    )

    text = build_maharishi_text(
        yogas,
        career,
        marriage,
        fortune,
        omniscient
    )

    return {
        "yogas": yogas,
        "career": career,
        "marriage_analysis": marriage,
        "fortune_index": fortune,
        "maharishi_text": text
    }

from .sade_sati import detect_sade_sati
from .kalsarp_types import detect_kalsarp_type
from .rajyoga_index import compute_rajyoga_index
from .career_probability import career_success_probability
from .ai_narrative import build_ai_narrative


def build_ultra_predictions(chart, dasha, dosha, strength):

    sade_sati = detect_sade_sati(chart)
    kalsarp_type = detect_kalsarp_type(chart)
    rajyoga_score = compute_rajyoga_index(chart, strength)
    career_score = career_success_probability(chart, strength)

    ai_text = build_ai_narrative(
        chart,
        rajyoga_score,
        career_score,
        sade_sati,
        kalsarp_type
    )

    return {
        "sade_sati": sade_sati,
        "kalsarp_type": kalsarp_type,
        "rajyoga_index": rajyoga_score,
        "career_probability": career_score,
        "ai_narrative": ai_text
    }

from .yogini_dasha_ai import yogini_predictions
from .transit_engine import monthly_transits
from .qa_engine import auto_qa_predictions
from .learning_weights import apply_prediction_weights
from .voice_blocks import build_voice_blocks
from .cosmic_narrative import build_cosmic_story


def build_cosmic_engine(chart, strength, dosha, dasha, supreme):

    yogini = yogini_predictions(dasha)

    transit = monthly_transits(chart)

    qa = auto_qa_predictions(chart, strength, dosha)

    weighted = apply_prediction_weights(
        strength,
        dosha,
        supreme
    )

    voice = build_voice_blocks(weighted)

    narrative = build_cosmic_story(
        yogini,
        transit,
        qa,
        supreme
    )

    return {
        "yogini_dasha": yogini,
        "transits": transit,
        "qa_predictions": qa,
        "weighted_scores": weighted,
        "voice_blocks": voice,
        "cosmic_narrative": narrative
    }

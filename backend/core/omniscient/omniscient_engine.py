from .prediction_fusion import fuse_predictions
from .confidence_ai import calculate_confidence
from .personality_ai import build_personality_profile
from .remedy_intelligence import smart_remedies
from .emotion_model import emotional_signature


def run_omniscient_engine(
        chart,
        strength,
        dosha,
        akashic,
        timeline,
        predictions,
        yogas):

    personality = build_personality_profile(chart, strength)

    emotions = emotional_signature(chart)

    fused = fuse_predictions(
        predictions,
        timeline,
        yogas,
        akashic
    )

    confidence = calculate_confidence(
        strength,
        dosha,
        fused
    )

    remedies = smart_remedies(
        dosha,
        emotions,
        personality
    )

    return {
        "personality": personality,
        "emotion_model": emotions,
        "omniscient_predictions": fused,
        "confidence_score": confidence,
        "smart_remedies": remedies
    }

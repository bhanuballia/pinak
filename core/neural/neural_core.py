"""
COSMIC NEURAL CORE
High-level reasoning layer above astrology modules.
"""

from core.neural.signal_fusion import fuse_signals
from core.neural.archetype_detector import detect_archetype
from core.neural.pattern_engine import detect_life_patterns
from core.neural.reasoning_engine import build_neural_summary
from core.destiny.signature_engine import build_destiny_signature
from core.life_vector.life_vector_engine import build_life_vector_predictions


def build_neural_context(report_data, adaptive=None):

    signals = fuse_signals(report_data)

    archetype = detect_archetype(report_data, signals)

    patterns = detect_life_patterns(report_data, signals)

    neural_summary = build_neural_summary(
        report_data,
        signals,
        archetype,
        patterns,
        adaptive
    )

    # Context object
    neural_context = {
        "signals": signals,
        "archetype": archetype,
        "patterns": patterns,
        "summary": neural_summary
    }

    # Store for access by other modules
    report_data["neural_context"] = neural_context

    # 7. Destiny Signature Integration
    destiny = build_destiny_signature(report_data, neural_context)
    report_data["destiny"] = destiny

    # 8. Life Vector Engine
    build_life_vector_predictions(report_data)

    return neural_context

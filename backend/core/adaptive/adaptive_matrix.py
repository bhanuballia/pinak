"""
ADAPTIVE COSMIC MATRIX
Learns from usage and modifies prediction behaviour.
"""

from core.adaptive.user_profile import build_user_profile
from core.adaptive.weighting_system import calculate_adaptive_weights
from core.adaptive.feedback_engine import load_memory


def adaptive_context(history, report_data):

    memory = load_memory()

    profile = build_user_profile(history, memory)

    weights = calculate_adaptive_weights(profile, report_data)

    return {
        "profile": profile,
        "weights": weights
    }

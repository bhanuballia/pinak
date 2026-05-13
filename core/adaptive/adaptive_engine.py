from core.adaptive.adaptive_context import build_adaptive_context
from core.adaptive.personality_profile import build_personality_profile
from core.adaptive.adaptive_weights import calculate_focus_weights
from core.adaptive.tone_engine import choose_tone
from core.adaptive.adaptive_rules import apply_adaptive_rules


def run_adaptive_intelligence(report_data):

    ctx = build_adaptive_context(report_data)

    profile = build_personality_profile(ctx)

    weights = calculate_focus_weights(ctx)

    tone = choose_tone(profile)

    adaptive_summary = apply_adaptive_rules(ctx, profile, weights)

    return {
        "profile": profile,
        "weights": weights,
        "tone": tone,
        "adaptive_summary": adaptive_summary
    }

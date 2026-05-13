from .personalization import personalize_text
from .neural_mode import run_rishi_neural_mode
from .pattern_memory import learn_from_chart
from .adaptive_strength import adjust_prediction_strength


def run_rishi_core(report_data, user_profile=None):

    # 1. Neural Reasoning Layer (Similarity & Confidence)
    report_data = run_rishi_neural_mode(report_data)

    # 2. Learn from new chart (Pattern Memory)
    learn_from_chart(report_data)

    # 3. Improve prediction confidence (Classical)
    report_data["rishi_strength"] = adjust_prediction_strength(report_data)

    # 4. Personalize writing style
    if user_profile:
        report_data = personalize_text(report_data, user_profile)

    return report_data

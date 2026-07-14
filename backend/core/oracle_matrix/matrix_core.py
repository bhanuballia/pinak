from core.oracle_matrix.context_memory import build_life_context
from core.oracle_matrix.domain_intelligence import analyse_domains
from core.oracle_matrix.signal_fusion import fuse_astrology_signals
from core.oracle_matrix.response_synthesizer import synthesize_response
from core.adaptive.adaptive_matrix import adaptive_context
from core.neural.neural_core import build_neural_context # Import Neural Core


def omniscient_oracle(question, report_data, history=None):

    history = history or []

    # 0️⃣ Adaptive Learning (Modifiers)
    adaptive = adaptive_context(history, report_data)

    # 1️⃣ Build life context from past questions
    life_context = build_life_context(history)

    # 2️⃣ Understand life domains involved
    domain_data = analyse_domains(question, report_data)

    # 3️⃣ Fuse astrology signals
    astro_signals = fuse_astrology_signals(report_data)

    # 3.5️⃣ Neural Context (High-Level Reasoning)
    neural = build_neural_context(report_data, adaptive)

    # 4️⃣ Generate final intelligent answer
    response = synthesize_response(
        question,
        life_context,
        domain_data,
        astro_signals,
        neural, # Pass Neural Context
        adaptive
    )

    return response

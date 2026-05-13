"""
ASTROCONSULT — ORACLE INTELLIGENCE CORE
Master controller that answers astrology questions.
"""

from core.oracle.oracle_router import detect_intent
from core.oracle.oracle_reasoner import build_oracle_context
from core.oracle.oracle_response_builder import build_oracle_response


def oracle_query(question, report_data):

    # 1️⃣ Detect what user is asking
    intent = detect_intent(question)

    # 2️⃣ Collect astrology signals
    context = build_oracle_context(intent, report_data)

    # 3️⃣ Build AI-style answer
    answer = build_oracle_response(question, intent, context)

    return {
        "question": question,
        "intent": intent,
        "answer": answer,
    }

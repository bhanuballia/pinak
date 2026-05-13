from .question_classifier import classify_question
from .domain_rules import career, marriage, finance, health, education


DOMAIN_HANDLERS = {
    "career": career.answer,
    "marriage": marriage.answer,
    "finance": finance.answer,
    "health": health.answer,
    "education": education.answer,
}


def default_answer(chart):
    return (
        "Based on your astronomical profile, this area of life is influenced "
        "by several planetary factors. For a specific answer, a more detailed "
        "session with an astrologer is recommended."
    )


def answer_question(question, chart, dasha, dosha, transits):
    domain = classify_question(question)

    handler = DOMAIN_HANDLERS.get(domain)
    if not handler:
        return default_answer(chart)

    return handler(question, chart, dasha, dosha, transits)

from .question_router import detect_question_type
from .oracle_reasoning import generate_reasoning
from .narrative_builder import build_oracle_response
from .context_memory import update_context


def oracle_answer(question, chart, strength, dosha, dasha, cosmic):

    qtype = detect_question_type(question)

    reasoning = generate_reasoning(
        question,
        qtype,
        chart,
        strength,
        dosha,
        dasha,
        cosmic
    )

    response = build_oracle_response(
        question,
        qtype,
        reasoning
    )

    update_context(question, response)

    return {
        "question": question,
        "type": qtype,
        "answer": response
    }

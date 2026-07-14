from .question_router import route_question
from .paramarshi_writer import build_answer_text


def ask_paramarshi(question, report_data):

    intent = route_question(question)

    answer_data = intent["handler"](question, report_data)

    text = build_answer_text(question, answer_data)

    return {
        "question": question,
        "answer": text,
        "data": answer_data
    }

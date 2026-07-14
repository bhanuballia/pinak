def build_answer_text(question, data):

    text = f"Question: {question}\n\n"

    if "prediction" in data:
        text += data["prediction"] + ". "

    if "summary" in data:
        text += data["summary"] + ". "

    if "warning" in data:
        text += data["warning"] + ". "

    return text

CHAT_HISTORY = []

def update_context(question, answer):

    CHAT_HISTORY.append({
        "q": question,
        "a": answer
    })

def get_history():
    return CHAT_HISTORY

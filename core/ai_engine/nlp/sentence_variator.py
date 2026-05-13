import random

CONNECTORS = [
    "Additionally",
    "Meanwhile",
    "At the same time",
    "Interestingly",
    "From another perspective"
]


def join_sentences(sentences):

    if not sentences:
        return ""

    result = sentences[0]

    for s in sentences[1:]:
        result += f". {random.choice(CONNECTORS)}, {s.lower()}"

    return result + "."

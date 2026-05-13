from .prashna_interpreter import prashna_handler
from .transit_reasoner import transit_handler


def route_question(q):

    q = q.lower()

    if "career" in q or "job" in q:
        return {"type": "career", "handler": prashna_handler}

    if "marriage" in q or "love" in q:
        return {"type": "relationship", "handler": prashna_handler}

    if "transit" in q or "2027" in q:
        return {"type": "transit", "handler": transit_handler}

    return {"type": "general", "handler": prashna_handler}

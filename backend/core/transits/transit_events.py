from .transit_text import transit_text

def build_transit_event(name, category):

    return {
        "type": "transit",
        "event": name,
        "category": category,
        "summary": transit_text(name)
    }

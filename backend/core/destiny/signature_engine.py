from core.destiny.vector_builder import build_destiny_vector
from core.destiny.destiny_classifier import classify_destiny
from core.destiny.destiny_strength import compute_destiny_power
from core.destiny.destiny_events import detect_destiny_events


def build_destiny_signature(report_data, neural=None):

    vector = build_destiny_vector(report_data, neural)

    destiny_type = classify_destiny(vector)

    power = compute_destiny_power(vector)

    events = detect_destiny_events(report_data, vector)

    return {
        "vector": vector,
        "type": destiny_type,
        "power": power,
        "events": events
    }

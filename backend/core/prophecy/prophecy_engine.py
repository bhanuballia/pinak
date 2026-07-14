from core.prophecy.event_detector import detect_life_events
from core.prophecy.destiny_score import calculate_destiny_score
from core.prophecy.timeline_builder import build_prophecy_timeline
from core.prophecy.prophecy_text_ai import generate_prophecy_text


def build_7d_prophecy(chart, dasha, dosha, strength):

    events = detect_life_events(chart, dasha, strength)

    destiny = calculate_destiny_score(chart, strength, dosha)

    timeline = build_prophecy_timeline(events, destiny)

    text = generate_prophecy_text(timeline, destiny)

    return {
        "events": events,
        "destiny_score": destiny,
        "timeline": timeline,
        "ai_text": text
    }

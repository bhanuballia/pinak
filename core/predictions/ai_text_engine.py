# core/predictions/ai_text_engine.py

def build_ai_summary(life_areas, timeline):

    text = []

    text.append("Your life path reflects evolving karmic themes.")

    for k, v in life_areas.items():
        text.append(f"{k.title()}: {v}")

    if timeline:
        text.append(
            f"Important shifts expected around {timeline[0]['year']} onward."
        )

    return " ".join(text)

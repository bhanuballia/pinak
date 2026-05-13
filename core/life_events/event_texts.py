def generate_event_text(category, year):
    texts = {
        "marriage": f"A significant window for relationship commitments and marital harmony is indicated in {year}.",
        "career": f"Professional peak and leadership opportunities are predicted for {year}.",
        "finance": f"A period of financial growth and new investment opportunities arises in {year}.",
        "health": f"Focus on wellness and preventive care is recommended during the {year} transition.",
        "spiritual": f"Deep inner growth and spiritual awakening are heightened in {year}."
    }
    return texts.get(category, f"Significant life shifts are predicted for the year {year}.")


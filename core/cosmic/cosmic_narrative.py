def build_cosmic_story(yogini, transit, qa, supreme):

    text = []

    text.append("Cosmic Cycle Insight:")
    text.append(yogini)

    text.append(
        f"Destiny probability indicates {supreme['destiny_probability']['fortune_level']}."
    )

    text.append(
        f"Career outlook: {qa.get('career','Balanced')}."
    )

    return " ".join(text)

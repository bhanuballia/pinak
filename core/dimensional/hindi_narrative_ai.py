def generate_dimensional_narrative(marriage, career, wealth, quantum):

    text = ""

    if marriage["probability"] > 0.6:
        text += "Auspicious yogas for marriage are indicated in your chart. "

    if quantum.get("probabilities",{}).get("career",0) > 0.7:
        text += "Career destiny strongly aligns with leadership karma. "

    if wealth and wealth[0]["wealth_index"] > 0.7:
        text += "Financial expansion phases are activated."

    return text

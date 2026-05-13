def generate_quantum_narrative(prob, paths, events):

    text = "Quantum Insight: "

    if prob["career"] > 0.7:
        text += "Your professional destiny shows strong upward momentum. "

    if prob["marriage"] < 0.5:
        text += "Relationships require patience and karmic maturity. "

    if events:
        text += f"{len(events)} significant life opportunities are visible."

    return text

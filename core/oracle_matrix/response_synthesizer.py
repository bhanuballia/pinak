from core.oracle_matrix.oracle_personality import oracle_tone


def synthesize_response(question, life_context, domain_data, astro, neural=None, adaptive=None):

    tone = oracle_tone(astro["cosmic_score"])

    intro = "Oracle Insight:\n"

    # Adaptive Tone Modifier
    if adaptive:
        weights = adaptive.get("weights", {})
        if weights.get("career", 1.0) > 1.15:
            intro += "Your destiny path currently emphasizes career evolution. "
        elif weights.get("relationship", 1.0) > 1.15:
             intro += "Your soul focus is shifting towards emotional connection. "


    if tone == "optimistic":
        intro += "Cosmic flow appears supportive. "

    elif tone == "cautious":
        intro += "Karmic patterns suggest careful movement. "

    else:
        intro += "Balanced planetary energies are active. "

    domain = domain_data["domain"]

    if domain == "career":
        return intro + "Career evolution depends on disciplined decisions."

    if domain == "relationship":
        return intro + "Emotional maturity will shape relationship outcomes."

    if domain == "finance":
        return intro + "Financial growth is tied to patience and planning."

    return intro + "Observe unfolding life patterns with awareness."

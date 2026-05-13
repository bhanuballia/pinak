def build_voice_blocks(weighted_scores):
    """
    Generates voice-ready narrative blocks based on cosmic weights.
    """
    score = weighted_scores.get("cosmic_score", 1.0)
    
    if score >= 1.3:
        return ["Your cosmic energy is at its zenith.", "Expect significant breakthroughs."]
    elif score >= 1.0:
        return ["The celestial alignment is supportive.", "Steady progress is indicated."]
    else:
        return ["Focus on internal balancing.", "Caution is advised in major transitions."]

from .oracle_prompts import ORACLE_TONE
import random


def build_oracle_response(question, qtype, reasoning):

    # Get base header or fallback
    header_base = qtype.split("_")[0]
    header = ORACLE_TONE.get(header_base, ORACLE_TONE.get(qtype, "✨ Cosmic Guidance:"))
    
    text = f"{header}\n\n"

    if not reasoning:
        text += "The cosmic energies for this specific inquiry are currently in a state of subtle transition. "
        text += "No direct configuration dominates this question, implying a path of internal discovery.\n"
    else:
        # Randomize order slightly based on question to avoid identical block structures
        seed = sum(ord(c) for c in question)
        random.seed(seed)
        shuffled_reasoning = list(reasoning)
        random.shuffle(shuffled_reasoning)
        
        for r in shuffled_reasoning:
            text += f"• {r}\n"

    # Much larger pool of closing guidance for uniqueness
    guidance_options = [
        "Trust gradual karmic unfolding.",
        "Patience is the vehicle for your manifestation.",
        "Your current efforts are sowing seeds for future abundance.",
        "Align your daily ritual with your higher purpose.",
        "The stars suggest movement through steadiness.",
        "Let the inner silence guide your outer actions.",
        "A quiet mind reflects the true light of the soul.",
        "Honesty in action brings clarity in results.",
        "The path opens as you take the first authentic step.",
        "Seek the lesson within the challenge.",
        "Abundance flows where attention goes.",
        "Your destiny is a conversation between you and the stars."
    ]
    
    # Deterministic but diverse selection
    idx = seed % len(guidance_options)
    text += f"\nGuidance: {guidance_options[idx]}"

    return text

import random

CAREER_OPENINGS = [
    "Professional momentum is gaining strength",
    "Career developments begin to accelerate",
    "Your vocational path shows progressive movement",
    "Growth-oriented opportunities may emerge"
]

RELATIONSHIP_OPENINGS = [
    "Emotional dynamics become more meaningful",
    "Relationships carry transformative lessons",
    "Partnership energy grows stronger"
]

SPIRITUAL_TONE = [
    "This phase encourages deeper inner awareness.",
    "Patience and spiritual grounding enhance outcomes.",
    "Mindful decisions lead to long-term stability."
]


def pick(pool):
    if not pool:
        return ""
    return random.choice(pool)

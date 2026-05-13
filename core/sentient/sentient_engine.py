from .archetype_engine import build_archetype
from .karma_engine import karmic_profile
from .destiny_engine import destiny_vector
from .psyche_engine import psyche_profile
from .narrative_ai import build_sentient_story


def run_sentient_engine(chart, strength, dosha, cosmic):

    archetype = build_archetype(chart, strength)
    karma = karmic_profile(chart, dosha)
    destiny = destiny_vector(chart, cosmic)
    psyche = psyche_profile(strength)

    story = build_sentient_story(
        archetype,
        karma,
        destiny,
        psyche
    )

    return {
        "archetype": archetype,
        "karma": karma,
        "destiny": destiny,
        "psyche": psyche,
        "sentient_story": story
    }

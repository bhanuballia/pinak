from .soul_age import detect_soul_age
from .karma_cycles import karmic_cycles
from .destiny_phases import build_destiny_phases
from .akashic_story import generate_akashic_story


def run_akashic_engine(chart, strength, dosha, cosmic, sentient):

    soul = detect_soul_age(chart, strength)

    cycles = karmic_cycles(chart, dosha)

    phases = build_destiny_phases(cosmic)

    story = generate_akashic_story(
        soul,
        cycles,
        phases,
        sentient
    )

    return {
        "soul_age": soul,
        "karma_cycles": cycles,
        "destiny_phases": phases,
        "akashic_story": story
    }

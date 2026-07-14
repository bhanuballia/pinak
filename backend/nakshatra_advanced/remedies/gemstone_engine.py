# nakshatra_advanced/remedies/gemstone_engine.py

GEMSTONES = {

    "Sun": "Ruby",
    "Moon": "Pearl",
    "Mars": "Red Coral",
    "Mercury": "Emerald",
    "Jupiter": "Yellow Sapphire",
    "Venus": "Diamond",
    "Saturn": "Blue Sapphire",
    "Rahu": "Hessonite",
    "Ketu": "Cat's Eye"
}


def recommend_gemstone(
    weak_planet
):

    return GEMSTONES.get(
        weak_planet,
        "None"
    )

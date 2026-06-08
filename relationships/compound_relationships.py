# relationships/compound_relationships.py

from relationships.natural_relationships import (
    get_natural_relationship
)

from relationships.temporary_relationships import (
    get_temporary_relationship
)

COMPOUND_MATRIX = {

    ("Friend", "Friend"):
        "Great Friend",

    ("Friend", "Enemy"):
        "Neutral",

    ("Enemy", "Friend"):
        "Neutral",

    ("Enemy", "Enemy"):
        "Great Enemy",

    ("Neutral", "Friend"):
        "Friend",

    ("Neutral", "Enemy"):
        "Enemy"
}


def get_compound_relationship(
    planet_a,
    planet_b,
    sign_a,
    sign_b
):

    natural = get_natural_relationship(
        planet_a,
        planet_b
    )

    temporary = get_temporary_relationship(
        sign_a,
        sign_b
    )

    return COMPOUND_MATRIX.get(

        (natural, temporary),

        "Neutral"
    )

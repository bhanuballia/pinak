# relationships/temporary_relationships.py

from relationships.constants import (
    TEMPORARY_FRIEND_HOUSES,
    TEMPORARY_ENEMY_HOUSES
)

def calculate_house_distance(
    sign_a,
    sign_b
):

    return (
        (sign_b - sign_a)
        % 12
    ) + 1


def get_temporary_relationship(
    sign_a,
    sign_b
):

    house = calculate_house_distance(
        sign_a,
        sign_b
    )

    if house in TEMPORARY_FRIEND_HOUSES:

        return "Friend"

    return "Enemy"

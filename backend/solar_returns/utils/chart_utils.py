def get_house(
    ascendant,
    planet_sign
):
    return (
        (planet_sign - ascendant) % 12
    ) + 1

# nakshatra/chandrabala.py

GOOD_HOUSES = [
    1, 3, 6, 7, 10, 11
]

def calculate_chandrabala(
    natal_moon_sign: int,
    transit_moon_sign: int
):

    house = (
        (transit_moon_sign - natal_moon_sign)
        % 12
    ) + 1

    return {

        "house": house,
        "favorable": house in GOOD_HOUSES
    }

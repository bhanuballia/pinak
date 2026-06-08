# nakshatra_advanced/kp/kp_sub_lords.py

from math import floor

KP_SUB_SEQUENCE = [
    "Ketu",
    "Venus",
    "Sun",
    "Moon",
    "Mars",
    "Rahu",
    "Jupiter",
    "Saturn",
    "Mercury"
]

DASHA_YEARS = {
    "Ketu": 7,
    "Venus": 20,
    "Sun": 6,
    "Moon": 10,
    "Mars": 7,
    "Rahu": 18,
    "Jupiter": 16,
    "Saturn": 19,
    "Mercury": 17
}

TOTAL_YEARS = 120


def calculate_kp_sub_lord(
    degrees_inside_nakshatra: float
):

    cumulative = 0.0

    for lord in KP_SUB_SEQUENCE:

        portion = (
            DASHA_YEARS[lord]
            / TOTAL_YEARS
        ) * 13.333333

        cumulative += portion

        if degrees_inside_nakshatra <= cumulative:

            return lord

    return KP_SUB_SEQUENCE[-1]
